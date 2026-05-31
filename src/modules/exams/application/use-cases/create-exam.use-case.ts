import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface CreateExamInput {
  groupId: string;
  title: string;
  institution: string;
  organization: string;
  year: number;
  roleName: string;
  durationMinutes: number;
  questionIds: string[];
}

export class CreateExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateExamInput): Promise<ExamEntity> {
    this.logger.log(CreateExamUseCase.name, `Creating exam: ${input.title}`);

    if (input.questionIds.length === 0) {
      this.exceptionsService.badRequestException({
        message: 'At least one question is required',
      });
    }

    if (input.durationMinutes < 1) {
      this.exceptionsService.badRequestException({
        message: 'durationMinutes must be at least 1',
      });
    }

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    for (const questionId of input.questionIds) {
      const question = await this.questionsRepository.findById(questionId);
      if (!question) {
        this.exceptionsService.notFoundException({
          message: `Question not found: ${questionId}`,
        });
      }
      if (question.groupId !== input.groupId) {
        this.exceptionsService.badRequestException({
          message: `Question ${questionId} does not belong to the exam group`,
        });
      }
    }

    const exam = new ExamEntity(
      randomUUID(),
      input.groupId,
      input.title,
      input.institution,
      input.organization,
      input.year,
      input.roleName,
      input.durationMinutes,
      new Date(),
    );

    const created = await this.examsRepository.create(exam);

    await this.examsRepository.setQuestions(
      created.id,
      input.questionIds.map((questionId, index) => ({
        questionId,
        sectionId: null,
      })),
    );

    return created;
  }
}
