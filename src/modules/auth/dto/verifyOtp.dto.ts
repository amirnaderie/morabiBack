import { Type } from 'class-transformer';
import { IsInt, IsString, Length, minLength } from 'class-validator';

export class VerifyOtp {
  @IsInt({ message: 'فرمت کد وارد شده صحیح نیست' })
  @Type(() => Number)
  token: number;

  @Length(32, 32, { message: 'فرمت اطلاعات ورودی صحیح نمی باشد' })
  @IsString()
  secret: string;
}
