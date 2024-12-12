import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from 'src/interfaces/user';
import { userTypes } from 'src/modules/users/entities/user-type.entity';

export class CreateGymMemberDto {
  @IsString({ message: ' شناسه‌کاربر صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌کاربر صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌کاربر صحیح نمیباشد' })
  readonly userId: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'دسته‌بندی‌والد باید عدد باشد' },
  )
  readonly categoryId: number;

  @Type(() => Date)
  @IsDate({ message: 'تاریخ‌اعتبار صحیح نمیباشد' })
  expireAt: Date;

  @IsString({ message: ' نوع کاربر باید متن نوشتاری باشد' })
  @MaxLength(500, { message: 'نوع کاربر باید حداکثر 10 حرف باشد' })
  @MinLength(3, { message: 'نوع کاربر باید حداقل شامل ۳ حرف باشد' })
  @IsEnum(userTypes, {
    message: `باشد ${Object.values(userTypes)} نوع کاربری باید یکی از موارد`,
  })
  type: UserType;
}
