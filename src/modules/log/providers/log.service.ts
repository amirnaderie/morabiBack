import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '../entities/log.entity';
import { Repository } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { TokenService } from 'src/modules/auth/providers/token.service';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) // You can inject without using forFeature()
    private readonly LogsRepository: Repository<Log>,
    private readonly als: AsyncLocalStorage<any>,
    private readonly tokenService: TokenService,
  ) {}

  async logData(
    methodName: string = '',
    request: string = '',
    logMessage: string,
  ): Promise<void> {
    const correlationId = this.als.getStore()['Correlationid'];
    const accessToken = this.als.getStore()['accessToken'];
    const decodedAccessToken = this.tokenService.decodeToken(accessToken);
    const userId = decodedAccessToken.id;
    const log = this.LogsRepository.create({
      methodName,
      request,
      userId,
      logMessage,
      correlationId,
    });
    await this.LogsRepository.save(log);
  }
}
