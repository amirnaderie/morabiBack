import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Task } from './task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { TaskStatus } from './enum/task-status.enum';
import { AsyncLocalStorage } from 'async_hooks';
import { GetUser } from '../auth/get-user.decorator';
import { TokenService } from '../auth/providers/token.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) // You can inject without using forFeature()
    private readonly tasksRepository: Repository<Task>,
    private readonly als: AsyncLocalStorage<any>,
    private readonly tokenService: TokenService
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const correlationId = this.als.getStore()['Correlationid'];
    const accessToken = this.als.getStore()['accessToken'];
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

    let tasks = await this.tasksRepository.find({
      where: whereCondition,
    });

    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const correlationId = this.als.getStore()['correlationId'];
    const accessToken = this.als.getStore()['accessToken'];
    const userData= this.tokenService.decodeToken(accessToken)
    console.log('correlationId',correlationId);
    //   const aaaa = this.als.getStore().get('userData');
    // const userData = this.als.getStore()['userData'];
    // const transactionId = this.als.getStore().get('userData');
    // console.log('userData', userData);

    const localUser = { id: user.id };
    const found = await this.tasksRepository.findOne({
      where: { id, user: localUser },
    });
    if (!found) throw new NotFoundException(`Task with Id ${id} not found`);
    return found;
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) throw new NotFoundException(`Task with Id ${id} not found`);
  //   return found;
  // }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    const cretaedTask = await this.tasksRepository.save(task);
    return cretaedTask;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const localUser = { id: user.id };
    const result = await this.tasksRepository.delete({ id, user: localUser });
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