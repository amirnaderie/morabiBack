import {
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class CreateFormDto {
  @IsString()
  @MaxLength(100, { message: 'نام فرم حداکثر 100 حرف باید باشد' })
  @MinLength(3, { message: 'نام فرم حداقل باید شامل 3 حرف باشد' })
  @IsNotEmpty({ message: 'نام فرم را وارد نمایید' })
  name: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  type?: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsString({ message: 'توضیحات فرم باید متن باشد' })
  @MaxLength(500, { message: 'توضیحات فرم حداکثر باید 500 حرف یاشد' })
  @MinLength(3, { message: 'توضیحات فرم حداقل باید شامل 3 حرف باشد' })
  description?: string;
}
