import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  IsOptional,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/modules/users/entities/user.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';

// Base DTO with shared properties
export class BasePlanDto {
  @IsString()
  @MaxLength(150)
  @IsNotEmpty({ message: 'نام برنامه را وارد نمایید' })
  planName: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'توضیحات برنامه را وارد نمایید' })
  planDescription: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(3)
  @Type(() => Number)
  gender?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(4)
  @Type(() => Number)
  weight?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(3)
  @Type(() => Number)
  place?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(4)
  @Type(() => Number)
  level?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  state: number;

  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  planTime: number;

  // @IsArray()
  // // @IsString({ each: true })
  // @IsOptional()
  // weekDays: string;

  @IsArray()
  @IsOptional()
  weekDays: any[];
}

// Create DTO
export class CreatePlanDto extends BasePlanDto {
  // @IsUUID('4')
  @IsString()
  @IsNotEmpty({ message: 'تصویر برنامه را وارد نمایید' })
  logo?: string;

  @IsArray()
  // @IsUUID('4', { each: true })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

// Update DTO
export class UpdatePlanDto extends PartialType(BasePlanDto) {
  @IsUUID('4')
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tags?: string[];
}

// Response DTO
export class PlanResponseDto {
  id: string;

  planName: string;

  planDescription: string;

  gender?: number;

  weight?: number;

  place?: number;

  level?: number;

  state: number;

  weekDays: string;

  creatorId: string;

  realmId: number;

  @Type(() => File)
  logo?: File;

  @Type(() => User)
  user?: User;

  @Type(() => Tag)
  tags?: Tag[];

  @Type(() => Realm)
  realm?: Realm;
}

// List Response DTO for pagination
export class PlanListResponseDto {
  @Type(() => PlanResponseDto)
  items: PlanResponseDto[];

  total: number;

  page: number;

  limit: number;
}

// Plan Filter DTO for search queries
export class PlanFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  gender?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  place?: number;

  @IsNumber()
  @IsOptional()
  level?: number;

  @IsNumber()
  @IsOptional()
  state?: number;

  @IsUUID('4')
  @IsOptional()
  creatorId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tags?: string[];
}
