import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFormQuestionDto {
  @IsNotEmpty({ message: '!متن سوال را وارد نمایید' })
  @IsString({ message: 'متن سوال باید مجموعه‌ای از حروف الفبا باشد' })
  readonly text: string;
}
