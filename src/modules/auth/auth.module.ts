import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './providers/auth.service';
import { MFAService } from './providers/mfa.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    TypeOrmModule.forFeature([User, Roles]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRESIN'),
          },
        };
      },
    }),
    HttpModule,
  ],
  providers: [AuthService, MFAService,TokenService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule,TokenService],
})
export class AuthModule {}
