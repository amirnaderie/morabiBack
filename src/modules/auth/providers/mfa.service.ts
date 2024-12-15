import { HttpService } from '@nestjs/axios';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as speakeasy from 'speakeasy';
import { VerifyOtp } from '../dto/verifyOtp.dto';
import { SendOtpDto } from '../dto/sendOtp.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { lastValueFrom } from 'rxjs';
import { UsersService } from 'src/modules/users/providers/users.service';
import { ProfileService } from 'src/modules/users/providers/profile.service';

@Injectable()
export class MFAService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private usersService: UsersService,
    private profileService: ProfileService,
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
        window: 3, // Allow a small drift time
        steps: parseInt(this.configService.get<string>('OTP_EXPIRESIN')),
      });
    }
  }

  async generate2FAForgetPassword(
    userMobile: string,
    req: Request,
  ): Promise<string> {
    const user: User = await this.usersService.getUserByMobile(userMobile, req);

    if (!user)
      throw new ConflictException('این شماره همراه پیش از این ثبت نشده است');

    const profile = await this.profileService.get(user);
    return this.sendSMS(
      {
        userName: profile.family,
        userFamily: profile.name,
        userMobile: user.userMobile,
      },
      req,
    );
  }

  // Send SMS using Twilio
  async send2FAToken(sendOtpDto: SendOtpDto, req: Request): Promise<string> {
    const { userMobile } = sendOtpDto;

    let user: User;
    try {
      user = await this.usersService.getUserByMobile(userMobile, req);
    } catch (error) {
      throw new Error('خطا در عملیات');
    }

    if (user)
      throw new ConflictException('این شماره همراه پیش از این ثبت شده است');

    // const profile = await this.profileService.get(user);

    return this.sendSMS(sendOtpDto, req);
  }

  private sendSMS = async (sendOtpDto: SendOtpDto, req: Request) => {
    const { userMobile, userFamily, userName } = sendOtpDto;
    const requestIp: string =
      (req as any).ip || (req as any).connection.remodeAddress;

    const ipExists = await this.redis.get(requestIp);

    if (ipExists)
      throw new ConflictException('جهت ارسال پیامک اندکی صبر فرمایید');
    const mobileIsExists = await this.redis.get(userMobile);

    if (mobileIsExists)
      throw new ConflictException('جهت ارسال پیامک اندکی صبر فرمایید');

    const secret = this.generate2FASecret(); // Save this secret in your user record in DB
    const token = this.generate2FAToken(secret);
    const smsUrl = `${this.configService.get<string>('PROVIDER_URL')}&receptor=${userMobile}&token=${token}`;

    const response = await lastValueFrom(this.httpService.post(smsUrl, null));

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

      await this.redis.set(
        userMobile,
        'true',
        'EX',
        parseInt(this.configService.get<string>('OTP_EXPIRESIN')),
      );

      await this.redis.set(
        requestIp,
        'true',
        'EX',
        parseInt(this.configService.get<string>('OTP_EXPIRESIN')),
      );

      return secret;
      //console.log('SMS sent successfully:', response.data);
      //return response.data;
    } else {
      throw new Error('خطا در عملیات');
    }
  };
}
