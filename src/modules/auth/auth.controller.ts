import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyOtp } from './dto/verifyOtp.dto';
import { AuthService } from './providers/auth.service';
import { MFAService } from './providers/mfa.service';
import { SendOtpDto } from './dto/sendOtp.dto';
import { SignUpDto } from './dto/singnUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mfaService: MFAService,
  ) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto, @Req() req: Request): Promise<void> {
    return this.authService.signUp(signUpDto, req);
  }

  @Post('send-otp')
  async generate2FA(@Body() sendOtpDto: SendOtpDto): Promise<string> {
    // Send the token via SMS
    return await this.mfaService.send2FAToken(sendOtpDto);
  }

  @Post('send-otp-forget-password')
  async generate2FAForgetPassword(
    @Body('userMobile') userMobile: string,
  ): Promise<string> {
    // Send the token via SMS
    return await this.mfaService.generate2FAForgetPassword(userMobile);
  }

  @Post('change-forgot-password')
  async changeForgotPassword(@Body() signUpDto: SignUpDto): Promise<void> {
    // Send the token via SMS
    return await this.authService.changeForgotPassword(signUpDto);
  }

  @Post('verify-otp')
  async verify2FA(@Body() verifyOtp: VerifyOtp) {
    const isValid = await this.mfaService.verify2FAToken(verifyOtp);
    if (!isValid) {
      // return { message: 'Invalid 2FA token' };
      throw new UnauthorizedException();
    }
    return { message: '2FA verified successfully' };
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    return await this.authService.signIn(signInDto, response, req);
  }

  @Get('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Signed out successfully' };
  }
}
