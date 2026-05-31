import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvModule } from '../../shared/config/env';
import { EnvService } from '../../shared/config/env';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthController } from './presentation/controllers/auth.controller';
import { AdminGuard } from './presentation/guards/admin.guard';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { LocalAuthGuard } from './presentation/guards/local-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService): JwtModuleOptions => ({
        secret: env.getJwtSecret(),
        signOptions: {
          expiresIn: env.getJwtExpiresIn(),
        } as JwtModuleOptions['signOptions'],
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    RolesGuard,
    AdminGuard,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard, AdminGuard],
})
export class AuthModule {}
