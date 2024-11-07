import { IsNumber, ValidateIf } from 'class-validator';

export class UploadFileDto {
  @IsNumber()
  @ValidateIf((object, value) => value !== undefined)
  @ValidateIf((object, value) => typeof value == 'number')
  screenSeconds?: number | undefined;
}
