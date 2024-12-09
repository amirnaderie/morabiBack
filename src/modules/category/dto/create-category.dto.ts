import {
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: ' نام باید متن نوشتاری باشد' })
  @MaxLength(50, { message: 'نام باید حداکثر 100 حرف باشد' })
  @MinLength(3, { message: 'نام باید حداقل شامل ۳ حرف باشد' })
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'نام باید متن نوشتاری باشد' },
  )
  readonly name: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'دسته‌بندی‌والد باید عدد باشد' },
  )
  @ValidateIf((object, value) => value !== null)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'دسته‌بندی‌والد باید عدد باشد' },
  )
  readonly parentId: number;
}
