import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  userFamily: string;

  @IsString()
  @MinLength(8, { message: 'رمز ورود حداقل باید 8 کاراکتر باشد' })
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'رمز ورود ضعیف است',
  })
  password: string;

  @IsOptional()
  @IsPhoneNumber('IR', { message: 'فرمت شماره موبایل صحیح نیست' })
  userMobile: string;
}
