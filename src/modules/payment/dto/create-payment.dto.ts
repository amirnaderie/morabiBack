import {
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString({ message: 'شناسه‌کاربر صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌کاربر صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌کاربر صحیح نمیباشد' })
  readonly userId: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'شناسه پکیج باید عدد باشد' },
  )
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'شناسه پکیج باید عدد باشد' },
  )
  readonly packageId: number;
}
