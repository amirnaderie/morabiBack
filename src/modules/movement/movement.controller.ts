import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MovementService } from './movement.service';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/providers/file.service';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Movement } from './entities/movement.entity';

@Controller('movement')
@UseGuards(AuthGuard)
export class MovementController {
  constructor(
    private readonly movementService: MovementService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      video?: Express.Multer.File;
      poster?: Express.Multer.File;
    },
    @Req() req: Request,
    @GetUser() user: User,
    @Body() createMovementDto: CreateMovementDto,
  ): Promise<Movement> {
    return await this.movementService.create(
      user,
      createMovementDto,
      files,
      req,
    );

    // console.log(result, 'result');
    // return `This action returns all movement`;
    // return result;
  }

  @Get()
  findAll() {
    return this.movementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return this.movementService.update(+id, updateMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementService.remove(+id);
  }
}
