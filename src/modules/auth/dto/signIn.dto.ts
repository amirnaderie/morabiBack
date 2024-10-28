import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'ورود شماره همراه اجباری است' })
  @IsPhoneNumber('IR', { message: 'فرمت شماره موبایل صحیح نیست' })
  userMobile: string;

  @IsString()
  @MinLength(6, { message: 'رمز ورود حداقل باید 6 کاراکتر باشد' })
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'رمز ورود ضعیف است',
  })
  password: string;
}
