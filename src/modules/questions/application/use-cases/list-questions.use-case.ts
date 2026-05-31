import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import {
  QuestionFilters,
  QuestionsRepository,
} from '../../domain/repositories/questions.repository';

export interface ListQuestionsInput {
  groupId?: string;
  discipline?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}

export interface ListQuestionsOutput {
  items: QuestionEntity[];
  total: number;
}

export class ListQuestionsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute(input?: ListQuestionsInput): Promise<ListQuestionsOutput> {
    this.logger.log(ListQuestionsUseCase.name, 'Listing questions');

    const filters: QuestionFilters = {
      groupId: input?.groupId,
      discipline: input?.discipline,
      topic: input?.topic,
      difficulty: input?.difficulty,
      tags: input?.tags,
    };

    const [items, total] = await Promise.all([
      this.questionsRepository.findMany(filters),
      this.questionsRepository.count(filters),
    ]);

    return { items, total };
  }
}
