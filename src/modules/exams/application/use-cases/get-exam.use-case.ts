import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamSectionEntity } from '../../domain/entities/exam-section.entity';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamSectionsRepository } from '../../domain/repositories/exam-sections.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface GetExamOutput {
  exam: ExamEntity;
  sections: ExamSectionEntity[];
  questionIds: string[];
  totalQuestions: number;
}

export class GetExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly examSectionsRepository: ExamSectionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<GetExamOutput> {
    this.logger.log(GetExamUseCase.name, `Getting exam: ${id}`);

    const exam = await this.examsRepository.findById(id);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    const [sections, questionIds] = await Promise.all([
      this.examSectionsRepository.findByExam(id),
      this.examsRepository.findQuestionIds(id),
    ]);

    return {
      exam,
      sections,
      questionIds,
      totalQuestions: questionIds.length,
    };
  }
}
