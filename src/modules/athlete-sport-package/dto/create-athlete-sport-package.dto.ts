import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
//CreateAthleteSportPackageDto
export class CreateAthleteSportPackageDto {
  @IsString({ message: 'شناسه‌مربی صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌مربی صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌مربی صحیح نمیباشد' })
  readonly mentorId: string;

  @IsString({ message: 'شناسه‌ورزشکار صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه‌ورزشکار صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه‌ورزشکار صحیح نمیباشد' })
  readonly athleteId: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'شناسه‌پکیج باید عدد باشد' },
  )
  readonly sportPackageId: number;
}
