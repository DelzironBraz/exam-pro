import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { TagsRepository } from '../../../tags/domain/repositories/tags.repository';
import { QuestionsRepository } from '../../domain/repositories/questions.repository';

export interface GetQuestionOutput {
  question: QuestionEntity;
  alternatives: AlternativeEntity[];
  tags: string[];
}

export class GetQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<GetQuestionOutput> {
    this.logger.log(GetQuestionUseCase.name, `Getting question: ${id}`);

    const question = await this.questionsRepository.findById(id);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    const [alternatives, tags] = await Promise.all([
      this.alternativesRepository.findByQuestionId(id),
      this.tagsRepository.findNamesByQuestionId(id),
    ]);

    return { question, alternatives, tags };
  }
}
