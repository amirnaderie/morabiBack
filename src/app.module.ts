import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { MovmentModule } from './modules/movment/movment.module';

@Module({
  imports: [
    AlsModule,
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.ENV}`, isGlobal: true }),
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
    MovmentModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(
    // inject the AsyncLocalStorage in the module constructor,
    private readonly als: AsyncLocalStorage<any>,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(AsyncContextMiddleware).forRoutes('*'); // Apply globally
    // consumer.apply(cookieParser()).forRoutes('*'); // Apply globally
    //   consumer
    //     .apply((req, res, next) => {
    //       // populate the store with some default values
    //       // based on the request,
    //       const store = {
    //         Correlationid: req.headers['x-correlation-id'],
    //       };

    //       // and pass the "next" function as callback
    //       // to the "als.run" method together with the store.
    //       this.als.run(store, () => next());
    //     })
    //     // and register it for all routes (in case of Fastify use '(.*)')
    //     .forRoutes('*');
  }
}
