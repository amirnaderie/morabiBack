import { Module } from '@nestjs/common';
import { LogService } from './providers/log.service';
import { LogController } from './log.controller';
import { AlsModule } from 'src/middleware/als.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Log]), AlsModule,AuthModule],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
