import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './providers/tasks.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { RolesGuard } from 'src/guards/role.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TasksController {
  private logger = new Logger('TaskContrller');
  constructor(private tasksService: TasksService) {}

  @Get()
  @SetMetadata('permission', 'read-task')
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.userName} retrieving all tasks`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  @SetMetadata('permission', 'create-task')
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  @SetMetadata('permission', 'get-task')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  delteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
