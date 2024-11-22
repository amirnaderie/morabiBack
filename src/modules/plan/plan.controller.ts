import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './providers/plan.service';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Plan } from './entities/plan.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('plans')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @SetMetadata('permission', 'create-plan')
  async create(
    @GetUser() user: User,
    @Body() createPlanDto: CreatePlanDto,
    @Req() req: Request,
  ): Promise<{ data: Plan }> {
    return await this.planService.create(createPlanDto, user, req);
  }

  @Get()
  @SetMetadata('permission', 'plans')
  findAll(@GetUser() user: User, @Req() req: Request) {
    return this.planService.findAll(user.id, req);
  }

  @Get(':id')
  @SetMetadata('permission', 'plan')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.planService.findOne(id, req);
  }

  @Put(':id')
  @SetMetadata('permission', 'update-plan')
  update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    return this.planService.update(id, updatePlanDto, user, req);
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-plan')
  remove(@Param('id') id: string, @GetUser() user: User, @Req() req: Request) {
    return this.planService.remove(id, user, req);
  }
}
