import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { usersUseCasesProviders } from './application/services/users-use-cases.provider';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: PrismaUserRepository,
    },
    ...usersUseCasesProviders,
  ],
  exports: [USER_REPOSITORY, PrismaUserRepository],
})
export class UsersModule {}
