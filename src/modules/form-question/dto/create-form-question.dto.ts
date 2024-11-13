import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFormQuestionDto {
  @IsNotEmpty({ message: '!متن سوال را وارد کنید' })
  @IsString({ message: 'متن سوال باید مجموعه‌ای از حروف الفبا باشد' })
  readonly text: string;

  @IsNotEmpty({ message: ' !فرم سوال را وارد کنید' })
  @IsString()
  readonly formId: string;
}
