import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';
import { User } from 'src/users/entities/user.entity';
// import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // You can inject without using forFeature()
    private readonly usresRepository: Repository<User>,
    private jwtService: JwtService,
    
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { userName, password, userMobile } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usresRepository.create({
      userName,
      password: hashedPassword,
      userMobile,
    });
    try {
      await this.usresRepository.save(user);
    } catch (error) {
      if (error.number === 2627)
        throw new ConflictException('نام کاربری تکراری است');
      else throw new InternalServerErrorException();
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { userName, password } = authCredentialsDto;
    const user = await this.usresRepository.findOneBy({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');
    }
    const payload = {
      username: user.userName,
      id: user.id,
      roles: user.roles.map((role: any) => role.name),
    };

    const accessToken: string = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
