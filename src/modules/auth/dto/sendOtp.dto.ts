import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendOtpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty({ message: 'ورود نام اجباری است' })
  userName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty({ message: 'ورود نام خانوادگی اجباری است' })
  userFamily: string;

  @IsNotEmpty({ message: 'ورود شماره همراه اجباری است' })
  @IsPhoneNumber('IR', { message: 'فرمت شماره موبایل صحیح نیست' })
  userMobile: string;
}
