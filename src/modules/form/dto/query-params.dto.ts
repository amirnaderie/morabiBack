import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class QueryFormDto {
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  type?: string;
}
