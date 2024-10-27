import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as speakeasy from 'speakeasy';
import { VerifyOtp } from '../dto/verifyOtp.dto';
import { SendOtpDto } from '../dto/sendOtp.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { PickType } from '@nestjs/mapped-types';

@Injectable()
export class MFAService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private usersService: UsersService,
  ) {}

  // Function to generate a 2FA secret and OTP
  generate2FASecret(): string {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret.base32; // Save this secret to your database for the user
  }

  // Function to generate the TOTP for the secret
  generate2FAToken(secret: string): string {
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });
    return token;
  }

  // Function to verify the TOTP token
  async verify2FAToken(verifyOtp: VerifyOtp): Promise<boolean> {
    const { token, secret } = verifyOtp;
    const remainCount = await this.redis.get(secret);
    if (!remainCount || parseInt(remainCount) === 0) return false;
    else {
      await this.redis.set(
        secret,
        parseInt(remainCount) - 1,
        'EX',
        this.configService.get<string>('OTP_EXPIRESIN'),
      );
      return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1, // Allow a small drift time
        steps: parseInt(this.configService.get<string>('OTP_EXPIRESIN')),
      });
    }
  }

  async generate2FAForgetPassword(userMobile: string): Promise<string> {
    const user: User = await this.usersService.getUserByMobile(userMobile);

    if (!user)
      throw new ConflictException('این شماره همراه پیش از این ثبت نشده است');

    return this.sendSMS({
      userFamily: user.userFamily,
      userMobile: user.userMobile,
      userName: user.userName,
    });
  }

  // Send SMS using Twilio
  async send2FAToken(sendOtpDto: SendOtpDto): Promise<string> {
    const { userMobile, userFamily, userName } = sendOtpDto;
    const user: User = await this.usersService.getUserByMobile(userMobile);

    if (user)
      throw new ConflictException('این شماره همراه پیش از این ثبت شده است');

    return this.sendSMS(sendOtpDto);
  }

  private sendSMS = async (sendOtpDto: SendOtpDto) => {
    const { userMobile, userFamily, userName } = sendOtpDto;
    const secret = this.generate2FASecret(); // Save this secret in your user record in DB
    const token = this.generate2FAToken(secret);
    const mockSmsUrl = 'https://run.mocky.io/v3/your-mock-id'; // Mocky URL

    // const response = await lastValueFrom(
    //   this.httpService.post(mockSmsUrl, {
    //     phoneNumber,
    //     message: `Your 2FA code is: ${token}`,
    //   }),
    // );
    console.log('token', token);
    console.log('secret', secret);
    const response = { status: 200 };
    if (response.status === 200) {
      await this.redis.set(
        `${token}${secret}`,
        JSON.stringify({ userMobile, userFamily, userName, secret }),
        'EX',
        parseInt(this.configService.get<string>('OTP_EXPIRESIN')) + 4,
      );

      await this.redis.set(
        secret,
        parseInt(this.configService.get<string>('OTP_COUNT')),
        'EX',
        parseInt(this.configService.get<string>('OTP_EXPIRESIN')),
      );
      return secret;
      //console.log('SMS sent successfully:', response.data);
      //return response.data;
    } else {
      throw new Error('Failed to send SMS');
    }
  };
}
