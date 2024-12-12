import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { GymMemberRelationService } from './gym-member-relation.service';
import { CreateGymMemberRelationDto } from './dto/create-gym-member-relation.dto';
import { UpdateGymMemberRelationDto } from './dto/update-gym-member-relation.dto';

@Controller('gym-member-relation')
export class GymMemberRelationController {
  constructor(
    private readonly gymMemberRelationService: GymMemberRelationService,
  ) {}

  @Post()
  create(@Body() createGymMemberRelationDto: CreateGymMemberRelationDto) {
    return this.gymMemberRelationService.create(createGymMemberRelationDto);
  }

  @Get()
  findAll() {
    return this.gymMemberRelationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymMemberRelationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGymMemberRelationDto: UpdateGymMemberRelationDto,
  ) {
    return this.gymMemberRelationService.update(
      +id,
      updateGymMemberRelationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymMemberRelationService.remove(+id);
  }
}
