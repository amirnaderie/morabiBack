import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
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

  @IsNumber()
  @IsNotEmpty({ message: 'مدت پکیج را وارد نمایید!' })
  @Min(1, { message: 'مدت پکیج معتبر نیست!' })
  @Max(180, { message: 'مدت پکیج معتبر نیست!' })
  @Type(() => Number)
  duration?: number;

  @IsNumber()
  @IsNotEmpty({ message: 'نوع پکیج را وارد نمایید!' })
  @Min(1)
  @Max(5)
  @Type(() => Number)
  durationType?: number;

  @IsNotEmpty({ message: 'مبلغ پکیج را وارد نمایید!' })
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((object, value) => /^\d+$/.test(value), {
    message: 'مقادیر ورودی معتبر نیست',
  })
  readonly cost: number;

  @IsNumber()
  @IsNotEmpty({ message: 'نوع ورزش را وارد نمایید!' })
  @Min(1)
  @Max(200)
  @Type(() => Number)
  categoryId?: number;
}
