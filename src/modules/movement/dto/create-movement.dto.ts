import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
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
  readonly name: string;

  @IsString()
  @ValidateIf((object, value) => value !== undefined)
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
