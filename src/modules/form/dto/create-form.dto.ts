import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateFormDto {
  @IsString()
  @MaxLength(100, { message: 'نام فرم حداکثر 100 حرف باید باشد' })
  @MinLength(3, { message: 'نام فرم حداقل باید شامل 3 حرف باشد' })
  @IsNotEmpty({ message: 'نام فرم را وارد نمایید' })
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  name: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  type?: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNumber({}, { message: 'وضعیت باید عدد انگلیسی باشد' })
  @Min(0, { message: 'وضعیت معتبر نیست' })
  @Max(1, { message: 'وضعیت معتبر نیست!' })
  @Type(() => Number)
  status?: number;

  @ValidateIf((object, value) => value !== undefined)
  @IsString({ message: 'توضیحات فرم باید متن باشد' })
  @MaxLength(500, { message: 'توضیحات فرم حداکثر باید 500 حرف یاشد' })
  @MinLength(3, { message: 'توضیحات فرم حداقل باید شامل 3 حرف باشد' })
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  description?: string;
}
