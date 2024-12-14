import { join } from 'path';
import { TagModule } from './modules/tag/tag.module';
import { LogModule } from './modules/log/log.module';
import { AlsModule } from './middleware/als.module';
import { FileModule } from './modules/file/file.module';
import { FormModule } from './modules/form/form.module';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { RedisModule } from './modules/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/role/role.module';
import { RealmModule } from './modules/realm/realm.module';
import { UtilityModule } from './utility/utility.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementModule } from './modules/movement/movement.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AsyncLocalStorage } from 'node:async_hooks';
import { IsUniqueConstraint } from './validation/is-unique-constraint';
import { FormQuestionModule } from './modules/form-question/form-question.module';
import { SubdomainMiddleware } from './middleware/subdomain.middleware';
import { AsyncContextMiddleware } from './middleware/async-context.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { PlanModule } from './modules/plan/plan.module';
import { CategoryModule } from './modules/category/category.module';
import { UserTypeModule } from './modules/mentor/mentor.module';
import { AthleteModule } from './modules/athlete/athlete.module';
import { MentorAthleteModule } from './modules/mentor-athlete/mentor-athlete.module';

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
          synchronize:
            configService.get<string>('DB_ALLOW_SYNC_WITH_TYPEORM') === 'true'
              ? true
              : false,
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
    FormModule,
    FormQuestionModule,
    PlanModule,
    CategoryModule,
    UserTypeModule,
    MentorAthleteModule,
    AthleteModule,
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
