import { IsString } from 'class-validator';

export class CreateFormQuestionDto {
  @IsString()
  text: string;

  @IsString()
  formId: string;

  @IsString()
  description: string;
}
