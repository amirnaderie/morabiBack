import { IsNotEmpty } from 'class-validator';

export class CreateMovementDto {
  @IsNotEmpty({ message: 'نام حرکت را وارد کنید!' })
  readonly name: string;

  @IsNotEmpty({ message: 'توضیح حرکت را وارد کنید' })
  readonly description: string;
}
