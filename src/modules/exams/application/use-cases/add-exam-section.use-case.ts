import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamSectionEntity } from '../../domain/entities/exam-section.entity';
import { ExamSectionsRepository } from '../../domain/repositories/exam-sections.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface AddExamSectionInput {
  examId: string;
  name: string;
  weight: number;
  questionIds?: string[];
}

export class AddExamSectionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly examSectionsRepository: ExamSectionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: AddExamSectionInput): Promise<ExamSectionEntity> {
    this.logger.log(AddExamSectionUseCase.name, `Adding section to exam ${input.examId}`);

    const exam = await this.examsRepository.findById(input.examId);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    if (input.weight <= 0) {
      this.exceptionsService.badRequestException({
        message: 'Section weight must be greater than 0',
      });
    }

    const order = await this.examSectionsRepository.getNextOrder(input.examId);

    const section = new ExamSectionEntity(
      randomUUID(),
      input.examId,
      input.name,
      input.weight,
      order,
    );

    const created = await this.examSectionsRepository.create(section);

    if (input.questionIds?.length) {
      await this.examSectionsRepository.assignQuestionsToSection(
        input.examId,
        created.id,
        input.questionIds,
      );
    }

    return created;
  }
}
