import { forwardRef, Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './providers/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AlsModule } from 'src/middleware/als.module';
import { LogModule } from '../log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => AuthModule),AlsModule,LogModule ], // Use forFeature here to register for this module
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
