import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateTagDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک تگ وارد کنید' })
  names: string[];
}
