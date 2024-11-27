import {
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class CreateFormDto {
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  @IsNotEmpty({ message: 'نام فرم را وارد نمایید' })
  name: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  type?: string;

  @IsString()
  @MaxLength(500)
  description?: string;
}
