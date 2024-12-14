import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMentorDto {
  @IsString({ message: ' شناسه‌کاربر صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌کاربر صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌کاربر صحیح نمیباشد' })
  readonly userId: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'دسته‌بندی‌ باید عدد باشد' },
  )
  readonly categoryId: number;
}
