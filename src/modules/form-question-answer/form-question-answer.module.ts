import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { FormQuestionAnswer } from './entities/form-question-answer.entity';
import { FormQuestionAnswerController } from './form-question-answer.controller';
import { FormQuestionAnswerService } from './providers/form-question-answer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormQuestionAnswer]),
    forwardRef(() => LogModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [FormQuestionAnswerController],
  providers: [FormQuestionAnswerService],
  exports: [FormQuestionAnswerService],
})
export class FormQuestionAnswerModule {}