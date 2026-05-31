import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamSectionsRepository } from '../../domain/repositories/exam-sections.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export class DeleteExamSectionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly examSectionsRepository: ExamSectionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(examId: string, sectionId: string): Promise<void> {
    this.logger.log(DeleteExamSectionUseCase.name, `Deleting section ${sectionId}`);

    const exam = await this.examsRepository.findById(examId);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    const section = await this.examSectionsRepository.findById(sectionId);
    if (!section || section.examId !== examId) {
      this.exceptionsService.notFoundException({ message: 'Section not found' });
    }

    await this.examSectionsRepository.delete(sectionId);
  }
}
