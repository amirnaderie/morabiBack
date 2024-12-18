import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AssignAthletesDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'حداقل یک ورزشکار را وارد نمایید' })
  readonly athleteIds: string[];
}
