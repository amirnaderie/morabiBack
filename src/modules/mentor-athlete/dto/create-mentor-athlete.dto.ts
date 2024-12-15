import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMentorAthleteDto {
  @IsString({ message: ' شناسه‌مربی صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌مربی صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌مربی صحیح نمیباشد' })
  readonly mentorId: string;

  @IsString({ message: ' شناسه‌ورزشکار صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌ورزشکار صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌ورزشکار صحیح نمیباشد' })
  readonly athleteId: string;
}
