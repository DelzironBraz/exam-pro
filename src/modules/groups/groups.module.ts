import { Module, forwardRef } from '@nestjs/common';
import { TagsModule } from '../tags/tags.module';
import { GROUPS_REPOSITORY } from './domain/repositories/groups.repository';
import { groupsUseCasesProviders } from './application/services/groups-use-cases.provider';
import { PrismaGroupsRepository } from './infra/repositories/prisma-groups.repository';
import { GroupsController } from './presentation/controllers/groups.controller';

@Module({
  imports: [forwardRef(() => TagsModule)],
  controllers: [GroupsController],
  providers: [
    PrismaGroupsRepository,
    {
      provide: GROUPS_REPOSITORY,
      useExisting: PrismaGroupsRepository,
    },
    ...groupsUseCasesProviders,
  ],
  exports: [GROUPS_REPOSITORY, PrismaGroupsRepository],
})
export class GroupsModule {}
