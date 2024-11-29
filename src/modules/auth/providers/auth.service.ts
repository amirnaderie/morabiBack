import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { SignUpDto } from '../dto/singnUp.dto';
import { MFAService } from './mfa.service';
import Redis from 'ioredis';
import { SignInDto } from '../dto/signIn.dto';
import { RolesService } from 'src/modules/role/providers/role.service';
import { Role } from 'src/modules/role/entities/role.entity';
import { LogService } from 'src/modules/log/providers/log.service';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UtilityService } from 'src/utility/providers/utility.service';
import { AsyncLocalStorage } from 'async_hooks';
// import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // You can inject without using forFeature()
    private readonly usresRepository: Repository<User>,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private mFAService: MFAService,
    private readonly logService: LogService,
    private readonly configService: ConfigService,
    private readonly utilityService: UtilityService,
    private readonly als: AsyncLocalStorage<any>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async signUp(signUpDto: SignUpDto, req: Request): Promise<void> {
    const { token, password, secret } = signUpDto;

    const isVerified: boolean = await this.mFAService.verify2FAToken({
      token,
      secret,
    });
    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const userData = await this.redis.get(`${token}${secret}`);
    const {
      userMobile,
      userFamily,
      userName,
      secret: savedSecret,
    } = JSON.parse(userData);
    if (savedSecret !== secret) throw new UnauthorizedException();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = await this.rolesService.findOne(2, req);

    const user = this.usresRepository.create({
      userName,
      password: hashedPassword,
      userMobile,
      userFamily,
      realmId: (req as any).subdomainId || 1,
    });
    try {
      user.roles = [role];
      await this.usresRepository.save(user);
    } catch (error) {
      if (error.number === 2627)
        throw new ConflictException('نام کاربری تکراری است');
      else throw new InternalServerErrorException();
    }
  }

  async changeForgotPassword(
    signUpDto: SignUpDto,
    req: Request,
  ): Promise<void> {
    const { token, password, secret } = signUpDto;

    const isVerified: boolean = await this.mFAService.verify2FAToken({
      token,
      secret,
    });
    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const userData = await this.redis.get(`${token}${secret}`);
    const { userMobile, secret: savedSecret } = JSON.parse(userData);
    if (savedSecret !== secret) throw new UnauthorizedException();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.usresRepository.findOneBy({
        userMobile,
        realmId: (req as any).subdomainId || 1,
      });
      user.password = hashedPassword;
      // user.updatedAt = new Date();
      if (user) {
        await this.usresRepository.save(user);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async refreshToken(response: Response) {
    const refreshToken: string = this.als.getStore()['refreshToken'];
    if (!refreshToken) throw new ForbiddenException();
    const payload = await this.redis.get(refreshToken);
    if (!payload) throw new ForbiddenException();
    const { accessToken, cookieOptions } = await this.createAccessToken(
      JSON.parse(payload),
    );

    response.cookie('accessToken', accessToken, cookieOptions);
    return { message: 'token Refreshed' };
  }
  async signIn(signInDto: SignInDto, response: Response, req: Request) {
    const { userMobile, password } = signInDto;
    const user = await this.usresRepository.findOne({
      where: {
        userMobile: userMobile,
        realmId: (req as any).subdomainId,
      },
      select: {
        id: true,
        password: true,
        userName: true,
      },
      relations: ['roles', 'roles.permissions', 'realm'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logService.logData(
        'signIn',
        JSON.stringify({ userMobile }),
        'login Failed',
      );
      throw new NotFoundException('نام کاربری یا رمز عبور اشتباه است');
    }

    const userPermissionsObj = user.roles
      .map((role: Role) => role.permissions)
      .flat();
    const userPermissionEnNames = userPermissionsObj.map(
      (permission) => permission.enName,
    );

    const payload = {
      userName: user.userName,
      id: user.id,
      realmId: user.realm.id,
      roles: user.roles.map((role: Role) => role.enName),
      permissions: userPermissionEnNames,
    };
    this.logService.logData(
      'signIn',
      JSON.stringify({ userMobile }),
      'Successfully logedIn',
    );

    const { accessToken, cookieOptions } =
      await this.createAccessToken(payload);

    const refreshTokencookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      maxAge:
        parseInt(this.configService.get<string>('REFRESH_TOKEN_EXPIRESIN')) *
        1000,
      secure: process.env.ENV === 'prod',
      domain: this.configService.get<string>('COOKIE_DOMAIN'), // Add domain
      path: '/', // Explicitly set path
    };

    const refreshToken = this.utilityService.randomString(32);
    await this.redis.set(
      refreshToken,
      JSON.stringify(payload),
      'EX',
      parseInt(this.configService.get<string>('REFRESH_TOKEN_EXPIRESIN')),
    );

    response.cookie('accessToken', accessToken, cookieOptions);
    response.cookie('refreshToken', refreshToken, refreshTokencookieOptions);

    return { message: 'Successfully signed in' };
  }

  createAccessToken = async (payload: any) => {
    const accessToken: string = await this.jwtService.sign(payload);
    if (!accessToken) {
      throw new UnauthorizedException('Authentication failed');
    }

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: parseInt(this.configService.get<string>('JWT_EXPIRESIN')) * 1000,
      secure: process.env.ENV === 'prod',
      domain: this.configService.get<string>('COOKIE_DOMAIN'), // Add domain
      path: '/', // Explicitly set path
    };
    return { accessToken, cookieOptions };
  };
}
