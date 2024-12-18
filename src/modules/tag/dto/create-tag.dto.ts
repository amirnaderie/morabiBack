import { ArrayMinSize, IsArray, IsString, ValidateIf } from 'class-validator';

export class CreateTagDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک تگ وارد نمایید' })
  @ValidateIf(
      (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
      { message: 'مقادیر ورودی معتبر نیست' },
    )
  names: string[];
}
