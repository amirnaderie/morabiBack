import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
// import { IsUnique } from 'src/validation/is-unique';

export class CreateMovementDto {
  @IsNotEmpty({ message: 'نام حرکت را وارد کنید!' })
  // @IsUnique({
  //   tableName: 'movement',
  //   column: 'name',
  //   message: 'حرکتی با این نام موجود است',
  // })
  readonly name: string;

  @IsNotEmpty({ message: 'توضیح حرکت را وارد کنید' })
  readonly description: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک تگ وارد کنید' })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک فایل وارد کنید' })
  files: string[];
}
