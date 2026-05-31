import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { QuestionsModule } from '../questions/questions.module';
import { TAGS_REPOSITORY } from './domain/repositories/tags.repository';
import { tagsUseCasesProviders } from './application/services/tags-use-cases.provider';
import { ListGroupTagsUseCase } from './application/use-cases/list-group-tags.use-case';
import { ListQuestionTagsUseCase } from './application/use-cases/list-question-tags.use-case';
import { SyncGroupTagsUseCase } from './application/use-cases/sync-group-tags.use-case';
import { SyncQuestionTagsUseCase } from './application/use-cases/sync-question-tags.use-case';
import { PrismaTagsRepository } from './infra/repositories/prisma-tags.repository';
import { TagsController } from './presentation/controllers/tags.controller';

@Module({
  imports: [forwardRef(() => GroupsModule), forwardRef(() => QuestionsModule)],
  controllers: [TagsController],
  providers: [
    PrismaTagsRepository,
    {
      provide: TAGS_REPOSITORY,
      useExisting: PrismaTagsRepository,
    },
    ...tagsUseCasesProviders,
  ],
  exports: [
    TAGS_REPOSITORY,
    PrismaTagsRepository,
    SyncQuestionTagsUseCase,
    SyncGroupTagsUseCase,
    ListQuestionTagsUseCase,
    ListGroupTagsUseCase,
  ],
})
export class TagsModule {}
