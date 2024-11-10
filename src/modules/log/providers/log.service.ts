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
    const correlationId: string = this.als.getStore()['correlationId'] || null;
    const accessToken: string = this.als.getStore()['accessToken'];
    const requestIp: string = this.als.getStore()['requestIp'];
    const realmId: number = this.als.getStore()['subdomainId'];
    let userId: string | null = '';
    if (accessToken) {
      const decodedAccessToken = this.tokenService.decodeToken(accessToken);
      userId = decodedAccessToken.id;
    } else userId = null;
    const log = this.LogsRepository.create({
      methodName,
      request,
      userId,
      logMessage,
      correlationId,
      requestIp,
      realmId,
    });
    await this.LogsRepository.save(log);
  }
}
