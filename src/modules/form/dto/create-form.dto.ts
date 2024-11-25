import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFormDto {
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  @IsNotEmpty({ message: 'نام فرم را وارد نمایید' })
  name: string;

  @IsString()
  @MaxLength(500)
  // @IsNotEmpty({ message: 'توضیحات فرم را وارد نمایید' })
  description?: string;
}
