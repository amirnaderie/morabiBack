import {
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  Post,
  SetMetadata,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { PaymentService } from './providers/payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { GetUser } from 'src/decorators/getUser.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../users/entities/user.entity';

@Controller('payment')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @SetMetadata('permission', 'create-payment')
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @GetUser() user: User,
  ) {
    return this.paymentService.create(createPaymentDto, user);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
