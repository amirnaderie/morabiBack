import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFormQuestionAnswerDto {
  @IsNotEmpty({ message: '!متن سوال را وارد کنید' })
  @IsString({ message: 'متن سوال باید مجموعه‌ای از حروف الفبا باشد' })
  readonly text: string;
}
