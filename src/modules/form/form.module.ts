import { forwardRef, Module } from '@nestjs/common';
import { FormService } from './providers/form.service';
import { FormController } from './form.controller';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form]),
    forwardRef(() => LogModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [FormController],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
