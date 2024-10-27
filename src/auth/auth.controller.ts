import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyOtp } from './dto/verifyOtp.dto';
import { AuthService } from './providers/auth.service';
import { MFAService } from './providers/mfa.service';
import { SendOtpDto } from './dto/sendOtp.dto';
import { SignUpDto } from './dto/singnUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mfaService: MFAService,
  ) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sendOtp')
  async generate2FA(@Body() sendOtpDto: SendOtpDto): Promise<string> {
    // Send the token via SMS
    return await this.mfaService.send2FAToken(sendOtpDto);
  }

  @Post('sendOtp_Forget_Password')
  async generate2FAForgetPassword(
    @Body('userMobile') userMobile: string,
  ): Promise<string> {
    // Send the token via SMS
    return await this.mfaService.generate2FAForgetPassword(userMobile);
  }

  @Post('change_Forgot_Password')
  async changeForgotPassword(@Body() signUpDto: SignUpDto): Promise<void> {
    // Send the token via SMS
    return await this.authService.changeForgotPassword(signUpDto);
  }

  @Post('verifyOtp')
  async verify2FA(@Body() verifyOtp: VerifyOtp) {
    const isValid = await this.mfaService.verify2FAToken(verifyOtp);
    if (!isValid) {
      // return { message: 'Invalid 2FA token' };
      throw new UnauthorizedException();
    }
    return { message: '2FA verified successfully' };
  }

  @Post('signin')
  signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }
}
