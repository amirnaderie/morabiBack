import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateFormQuestionDto {
  @IsNotEmpty({ message: '!متن سوال را وارد نمایید' })
  @IsString({ message: 'متن سوال باید مجموعه‌ای از حروف الفبا باشد' })
  @ValidateIf(
    (object, value) => /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(value),
    { message: 'مقادیر ورودی معتبر نیست' },
  )
  readonly text: string;

  @IsNotEmpty({ message: ' !فرم سوال را وارد نمایید' })
  @IsString()
  readonly formId: string;
}
