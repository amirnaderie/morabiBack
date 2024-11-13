import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { FormQuestion } from './entities/form-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form-question.controller';
import { FormQuestionService } from './providers/form-question.service';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormQuestion]),
    forwardRef(() => LogModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [FormController],
  providers: [FormQuestionService],
  exports: [FormQuestionService],
})
export class FormQuestionModule {}
