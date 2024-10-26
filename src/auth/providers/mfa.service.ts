import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as speakeasy from 'speakeasy';
import { VerifyOtp } from '../dto/verifyOtp.dto';
import { sendOtpDto } from '../dto/sendOtp.dto';
import { UsersService } from 'src/users/users.service';

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

  // Send SMS using Twilio
  async send2FAToken(sendOtpDto: sendOtpDto): Promise<string> {
    try {
      const { userMobile, userFamily, userName } = sendOtpDto;
      const isMobileExists: boolean =
        await this.usersService.userMobileExists(userMobile);
      if (!isMobileExists) {
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
            JSON.stringify({ userMobile, userFamily, userName }),
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
      }
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      throw new Error('Failed to send SMS');
    }
  }
}
