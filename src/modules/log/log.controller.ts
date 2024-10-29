import { Controller } from '@nestjs/common';
import { LogService } from './providers/log.service';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
}
