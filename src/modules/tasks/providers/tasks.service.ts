import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Task } from '../task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { TaskStatus } from '../enum/task-status.enum';
import { AsyncLocalStorage } from 'async_hooks';
import { TokenService } from '../../auth/providers/token.service';
import { LogService } from '../../log/providers/log.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) // You can inject without using forFeature()
    private readonly tasksRepository: Repository<Task>,
    private readonly als: AsyncLocalStorage<any>,
    private readonly tokenService: TokenService,
    private readonly logService: LogService,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const localUser = { id: user.id };
    let whereCondition: any = { user: localUser }; // Base condition: filter by user

    if (status) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition = [
        { ...whereCondition, title: Like(`%${search}%`) },
        { ...whereCondition, description: Like(`%${search}%`) },
      ];
    }

    const tasks = await this.tasksRepository.find({
      where: whereCondition,
    });

    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    this.logService.logData(
      'TaskById',
      JSON.stringify({ id, user }),
      'Successfully retrieved',
    );
    //   const aaaa = this.als.getStore().get('userData');
    // const userData = this.als.getStore()['userData'];
    // const transactionId = this.als.getStore().get('userData');
    // console.log('userData', userData);

    const found = await this.tasksRepository.findOne({
      where: { id },
    });
    if (!found) throw new NotFoundException(`Task with Id ${id} not found`);
    return found;
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) throw new NotFoundException(`Task with Id ${id} not found`);
  //   return found;
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      // user,
    });
    const cretaedTask = await this.tasksRepository.save(task);
    return cretaedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`Task with Id ${id} not found`);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    if (task) {
      task.status = status;
      await this.tasksRepository.save(task);
    }
    return task;
  }
}
