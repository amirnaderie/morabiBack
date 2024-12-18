import {
  IsArray,
  IsString,
  IsNumber,
  ValidateIf,
  IsNotEmpty,
  ArrayMinSize,
} from 'class-validator';
// import { IsUnique } from 'src/validation/is-unique';

export class CreateMovementDto {
  @IsNotEmpty({ message: 'نام حرکت را وارد نمایید!' })
  // @IsUnique({
  //   tableName: 'movement',
  //   column: 'name',
  //   message: 'حرکتی با این نام موجود است',
  // })
  @IsString()
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly name: string;

  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly description: string;

  @IsNumber()
  readonly screenSeconds?: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک تگ وارد نمایید' })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک فایل وارد نمایید' })
  files: string[];
}
