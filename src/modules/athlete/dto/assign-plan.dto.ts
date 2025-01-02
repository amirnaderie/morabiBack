import { IsString, MaxLength, MinLength } from 'class-validator';

export class AssignPlanDto {
  @IsString({ message: ' شناسه ورزشکار صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه ورزشکار صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه ورزشکار صحیح نمیباشد' })
  readonly athleteId: string;

  @IsString({ message: ' شناسه برنامه صحیح نمیباشد' })
  @MaxLength(36, { message: 'شناسه برنامه صحیح نمیباشد' })
  @MinLength(36, { message: 'شناسه برنامه صحیح نمیباشد' })
  readonly planId: string;
}
