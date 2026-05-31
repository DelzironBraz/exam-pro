import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { QuestionAnswerEntity } from '../../domain/entities/question-answer.entity';
import { QuestionAnswersRepository } from '../../domain/repositories/question-answers.repository';
import { QuestionAnswerMapper } from '../prisma/question-answer.mapper';

@Injectable()
export class PrismaQuestionAnswersRepository
  extends PrismaRepository
  implements QuestionAnswersRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(answer: QuestionAnswerEntity): Promise<QuestionAnswerEntity> {
    const created = await this.prisma.questionAnswer.create({
      data: {
        id: answer.id,
        userId: answer.userId,
        questionId: answer.questionId,
        selectedAlternativeId: answer.selectedAlternativeId,
        timeSpentSeconds: answer.timeSpentSeconds,
        isCorrect: answer.isCorrect,
        createdAt: answer.createdAt,
      },
    });
    return QuestionAnswerMapper.toDomain(created);
  }
}
