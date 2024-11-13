import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { FormQuestion } from './entities/form-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormQuestionService } from './providers/form-question.service';
import { forwardRef, Module } from '@nestjs/common';
import { FormQuestionController } from './form-question.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormQuestion]),
    forwardRef(() => LogModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [FormQuestionController],
  providers: [FormQuestionService],
  exports: [FormQuestionService],
})
export class FormQuestionModule {}
