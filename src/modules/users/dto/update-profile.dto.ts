import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: ' نام باید متن نوشتاری باشد' })
  @MaxLength(50, { message: 'نام باید حداکثر 50 حرف باشد' })
  @MinLength(3, { message: 'نام باید حداقل شامل ۳ حرف باشد' })
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly name: string;

  @IsString({ message: ' نام‌خانوادگی باید متن نوشتاری باشد' })
  @MaxLength(50, { message: 'نام‌خانوادگی باید حداکثر 50 حرف باشد' })
  @MinLength(3, { message: 'نام‌خانوادگی باید حداقل شامل ۳ حرف باشد' })
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly family: string;

  @IsString({ message: ' توضیحات باید متن نوشتاری باشد' })
  @MaxLength(250, { message: 'توضیحات باید حداکثر 250 حرف باشد' })
  @MinLength(3, { message: 'توضیحات باید حداقل شامل ۳ حرف باشد' })
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly info: string;

  @IsString({ message: ' توضیحات‌بیماری باید متن نوشتاری باشد' })
  @MaxLength(500, { message: 'توضیحات‌بیماری باید حداکثر 500 حرف باشد' })
  @MinLength(3, { message: 'توضیحات‌بیماری باید حداقل شامل ۳ حرف باشد' })
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly descriptionDisease: string;

  @IsString({ message: ' سابقه‌ورزشی باید متن نوشتاری باشد' })
  @MaxLength(500, { message: 'سابقه‌ورزشی باید حداکثر 500 حرف باشد' })
  @MinLength(3, { message: 'سابقه‌ورزشی باید حداقل شامل ۳ حرف باشد' })
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly sportsBackground: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 300,
    },
    { message: 'وزن باید عدد باشد حداکثر 300 کیلوگرم' },
  )
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'وزن باید عدد باشد' },
  )
  readonly weight: number;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 300,
    },
    { message: 'قد باید عدد باشد حداکثر 250 سانتی‌متر' },
  )
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'قد باید عدد باشد' },
  )
  readonly height: number;

  @ValidateIf((object, value) => value !== undefined)
  @Type(() => Date)
  @IsDate({ message: 'تاریخ‌تولد باید تاریخ باشد' })
  birthdate: Date;
}
