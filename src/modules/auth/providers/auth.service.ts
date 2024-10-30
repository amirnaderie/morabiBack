import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { Role } from 'src/modules/role/role.entity';
// import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // You can inject without using forFeature()
    private readonly usresRepository: Repository<User>,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private mFAService: MFAService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
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
    const user = this.usresRepository.create({
      userName,
      password: hashedPassword,
      userMobile,
      userFamily,
    });
    try {
      await this.usresRepository.save(user);
    } catch (error) {
      if (error.number === 2627)
        throw new ConflictException('نام کاربری تکراری است');
      else throw new InternalServerErrorException();
    }
  }

  async changeForgotPassword(signUpDto: SignUpDto): Promise<void> {
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
      const user = await this.usresRepository.findOneBy({ userMobile });
      user.password = hashedPassword;
      // user.updatedAt = new Date();
      if (user) {
        await this.usresRepository.save(user);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { userMobile, password } = signInDto;
    const user = await this.usresRepository.findOne({
      where: { userMobile: userMobile },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');
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
      roles: user.roles.map((role: Role) => role.enName),
      permissions: userPermissionEnNames,
    };

    const accessToken: string = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
