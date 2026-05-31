import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { QuestionsModule } from '../questions/questions.module';
import { EXAM_ATTEMPT_ANSWERS_REPOSITORY } from './domain/repositories/exam-attempt-answers.repository';
import { EXAM_ATTEMPTS_REPOSITORY } from './domain/repositories/exam-attempts.repository';
import { EXAM_SECTIONS_REPOSITORY } from './domain/repositories/exam-sections.repository';
import { EXAMS_REPOSITORY } from './domain/repositories/exams.repository';
import { examsUseCasesProviders } from './application/services/exams-use-cases.provider';
import { PrismaExamAttemptAnswersRepository } from './infra/repositories/prisma-exam-attempt-answers.repository';
import { PrismaExamAttemptsRepository } from './infra/repositories/prisma-exam-attempts.repository';
import { PrismaExamSectionsRepository } from './infra/repositories/prisma-exam-sections.repository';
import { PrismaExamsRepository } from './infra/repositories/prisma-exams.repository';
import { ExamsController } from './presentation/controllers/exams.controller';

@Module({
  imports: [forwardRef(() => GroupsModule), forwardRef(() => QuestionsModule)],
  controllers: [ExamsController],
  providers: [
    PrismaExamsRepository,
    { provide: EXAMS_REPOSITORY, useExisting: PrismaExamsRepository },
    PrismaExamSectionsRepository,
    { provide: EXAM_SECTIONS_REPOSITORY, useExisting: PrismaExamSectionsRepository },
    PrismaExamAttemptsRepository,
    { provide: EXAM_ATTEMPTS_REPOSITORY, useExisting: PrismaExamAttemptsRepository },
    PrismaExamAttemptAnswersRepository,
    {
      provide: EXAM_ATTEMPT_ANSWERS_REPOSITORY,
      useExisting: PrismaExamAttemptAnswersRepository,
    },
    ...examsUseCasesProviders,
  ],
  exports: [EXAMS_REPOSITORY, EXAM_ATTEMPTS_REPOSITORY],
})
export class ExamsModule {}
