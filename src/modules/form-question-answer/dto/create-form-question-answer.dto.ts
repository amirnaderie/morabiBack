import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFormQuestionAnswerDto {
  @IsNotEmpty({ message: '!پاسخ سوال را وارد کنید' })
  @IsString({ message: 'پاسخ سوال باید مجموعه‌ای از حروف الفبا باشد' })
  readonly text: string;

  @IsNotEmpty({ message: ' شناسه سوال را وارد کنید' })
  @IsString()
  readonly questionId: string;
}
