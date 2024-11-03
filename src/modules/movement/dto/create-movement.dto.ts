import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovementDto {
  @IsNotEmpty({ message: 'نام حرکت را وارد کنید!' })
  readonly name: string;

  @IsNotEmpty({ message: 'توضیح حرکت را وارد کنید' })
  readonly description: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک تگ وارد کنید' })
  tags: string[];
}
