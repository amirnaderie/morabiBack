import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VerifyOtp } from './verifyOtp.dto';

export class SignUpDto extends VerifyOtp {
  @IsString()
  @MinLength(6, { message: 'رمز ورود حداقل باید 6 کاراکتر باشد' })
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'رمز ورود ضعیف است',
  })
  password: string;
}
