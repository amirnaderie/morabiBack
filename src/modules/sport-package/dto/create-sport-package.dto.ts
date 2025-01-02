import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateSportPackageDto {
  @IsNotEmpty({ message: 'نام پکیج را وارد نمایید!' })
  @IsString()
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly name: string;

  @IsNumber({}, { message: 'مدت پکیج باید عدد انگلیسی باشد' })
  @IsNotEmpty({ message: 'مدت پکیج را وارد نمایید!' })
  @Min(1, { message: 'مدت پکیج معتبر نیست!' })
  @Max(180, { message: 'مدت پکیج معتبر نیست!' })
  @Type(() => Number)
  duration?: number;

 
  @IsNotEmpty({ message: 'مبلغ پکیج را وارد نمایید!' })
  @IsNumber({}, { message: 'مبلغ ورزش باید عدد انگلیسی باشد' })
  @Type(() => Number)
  @ValidateIf((object, value) => /^\d+$/.test(value), {
    message: 'مقادیر ورودی معتبر نیست',
  })
  readonly cost: number;

  @IsNumber({}, { message: 'نوع ورزش باید عدد انگلیسی باشد' })
  @IsNotEmpty({ message: 'نوع ورزش را وارد نمایید!' })
  @Min(1)
  @Max(200)
  @Type(() => Number)
  categoryId?: number;

  // @IsString({ message: 'شناسه‌مربی صحیح نمیباشد' })
  // @MaxLength(36, { message: 'شناسه‌مربی صحیح نمیباشد' })
  // @MinLength(36, { message: 'شناسه‌مربی صحیح نمیباشد' })
  // readonly mentorId: string;
}
