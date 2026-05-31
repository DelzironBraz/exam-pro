import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import { QuestionsRepository } from '../../domain/repositories/questions.repository';

export interface UpdateQuestionInput {
  questionId: string;
  statement?: string;
  discipline?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  explanation?: string;
}

export class UpdateQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: UpdateQuestionInput): Promise<QuestionEntity> {
    this.logger.log(UpdateQuestionUseCase.name, `Updating question: ${input.questionId}`);

    const existing = await this.questionsRepository.findById(input.questionId);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    const updated = new QuestionEntity(
      existing.id,
      input.statement ?? existing.statement,
      existing.groupId,
      input.discipline !== undefined ? input.discipline : existing.discipline,
      input.topic !== undefined ? input.topic : existing.topic,
      input.difficulty ?? existing.difficulty,
      input.explanation !== undefined ? input.explanation : existing.explanation,
      existing.createdBy,
      existing.createdAt,
    );

    return this.questionsRepository.update(updated);
  }
}
