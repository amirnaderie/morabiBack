import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class VerifyOtp {
  @IsInt({ message: 'فرمت کد وارد شده صحیح نیست' })
  @Type(() => Number)
  token: number;

  @IsString()
  secret: string;
}
