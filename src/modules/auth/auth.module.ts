import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../user/entity/role.entity';
import { User } from '../user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayModule } from '../gateway/gateway.module';
@Module({
  imports: [
    UserModule,
    GatewayModule,
    TypeOrmModule.forFeature([Role, User]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.tokenExpiresTime'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
