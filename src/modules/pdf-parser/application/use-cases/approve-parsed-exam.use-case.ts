import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamEntity } from '../../../exams/domain/entities/exam.entity';
import { ExamsRepository } from '../../../exams/domain/repositories/exams.repository';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { AlternativeEntity } from '../../../questions/domain/entities/alternative.entity';
import { QuestionEntity } from '../../../questions/domain/entities/question.entity';
import { DifficultyLevel } from '../../../questions/domain/enums/difficulty-level.enum';
import { AlternativesRepository } from '../../../questions/domain/repositories/alternatives.repository';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';
import {
  deserializeParsedQuestions,
  ExamParsePayload,
} from '../utils/parsed-payload.serializer';
import { validateParsedQuestions } from '../utils/validate-parsed-questions.util';

export interface ApproveParsedExamInput {
  jobId: string;
  userId: string;
  title: string;
  groupId: string;
  institution: string;
  organization: string;
  year: number;
  roleName: string;
  durationMinutes: number;
}

export interface ApproveParsedExamOutput {
  examId: string;
  questionIds: string[];
}

export class ApproveParsedExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly examsRepository: ExamsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ApproveParsedExamInput): Promise<ApproveParsedExamOutput> {
    this.logger.log(ApproveParsedExamUseCase.name, `Approving exam import ${input.jobId}`);

    const job = await this.importJobsRepository.findById(input.jobId);
    if (!job) {
      this.exceptionsService.notFoundException({ message: 'Import job not found' });
    }

    if (job.uploadedBy !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Import job does not belong to this user',
      });
    }

    if (job.type !== ImportType.EXAM) {
      this.exceptionsService.badRequestException({ message: 'Job is not an exam import' });
    }

    if (job.status !== ImportStatus.COMPLETED) {
      this.exceptionsService.badRequestException({
        message: 'Job must be processed before approval',
      });
    }

    if (job.approvedRefId) {
      this.exceptionsService.badRequestException({ message: 'Job already approved' });
    }

    const payload = job.parsedPayload as ExamParsePayload | null;
    if (!payload || payload.kind !== 'exam') {
      this.exceptionsService.badRequestException({ message: 'Invalid parsed payload' });
    }

    const parsedQuestions = deserializeParsedQuestions(payload.questions);
    const validation = validateParsedQuestions(parsedQuestions);
    if (!validation.valid) {
      this.exceptionsService.badRequestException({
        message: `Parsed exam has validation errors: ${validation.issues.map((i) => i.message).join('; ')}`,
      });
    }

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const questionIds: string[] = [];

    for (const parsed of parsedQuestions) {
      const questionId = randomUUID();
      const now = new Date();

      await this.questionsRepository.create(
        new QuestionEntity(
          questionId,
          parsed.statement,
          input.groupId,
          parsed.discipline ?? null,
          parsed.topic ?? null,
          DifficultyLevel.MEDIUM,
          null,
          input.userId,
          now,
        ),
      );

      const alternatives = parsed.alternatives.map(
        (alt) =>
          new AlternativeEntity(
            randomUUID(),
            questionId,
            alt.label,
            alt.content,
            alt.isCorrect,
          ),
      );

      await this.alternativesRepository.createMany(alternatives);
      questionIds.push(questionId);
    }

    const exam = await this.examsRepository.create(
      new ExamEntity(
        randomUUID(),
        input.groupId,
        input.title,
        input.institution,
        input.organization,
        input.year,
        input.roleName,
        input.durationMinutes,
        new Date(),
      ),
    );

    await this.examsRepository.setQuestions(
      exam.id,
      questionIds.map((questionId, index) => ({ questionId, sortOrder: index })),
    );

    await this.importJobsRepository.markApproved(input.jobId, exam.id);

    return { examId: exam.id, questionIds };
  }
}
