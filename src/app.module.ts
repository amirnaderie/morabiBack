import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';
import { UsersModule } from './modules/users/users.module';

import { RolesModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';

import { FileModule } from './modules/file/file.module';
import { UtilityModule } from './utility/utility.module';

import { AlsModule } from './middleware/als.module';
import { AsyncLocalStorage } from 'node:async_hooks';
import { LogModule } from './modules/log/log.module';
import { AsyncContextMiddleware } from './middleware/async-context.middleware';

import { TagModule } from './modules/tag/tag.module';
import { MovementModule } from './modules/movement/movement.module';
import { IsUniqueConstraint } from './validation/is-unique-constraint';
import { RealmModule } from './modules/realm/realm.module';
import { SubdomainMiddleware } from './middleware/subdomain.middleware';

@Module({
  imports: [
    AlsModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.ENV}`,
      isGlobal: true,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mssql',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [join(__dirname, '**/*.entity.{ts,js}')],
          synchronize: true,
          autoLoadEntities: true,
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
        };
      },
    }),
    AuthModule,
    RedisModule,
    UsersModule,
    RolesModule,
    PermissionModule,
    FileModule,
    UtilityModule,
    LogModule,
    TagModule,
    MovementModule,
    RealmModule,
  ],
  providers: [IsUniqueConstraint],
})
export class AppModule implements NestModule {
  constructor(
    // inject the AsyncLocalStorage in the module constructor,
    private readonly als: AsyncLocalStorage<any>,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SubdomainMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(AsyncContextMiddleware).forRoutes('*'); // Apply globally
  }
}
