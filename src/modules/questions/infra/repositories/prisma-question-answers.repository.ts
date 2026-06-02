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
        textAnswer: answer.textAnswer,
        similarityScore: answer.similarityScore,
        timeSpentSeconds: answer.timeSpentSeconds,
        isCorrect: answer.isCorrect,
        createdAt: answer.createdAt,
      },
    });
    return QuestionAnswerMapper.toDomain(created);
  }

  async findLatestByUserForQuestions(
    userId: string,
    questionIds: string[],
  ): Promise<Map<string, QuestionAnswerEntity>> {
    const map = new Map<string, QuestionAnswerEntity>();
    if (questionIds.length === 0) {
      return map;
    }

    const answers = await this.prisma.questionAnswer.findMany({
      where: { userId, questionId: { in: questionIds } },
      orderBy: { createdAt: 'desc' },
    });

    for (const answer of answers) {
      if (!map.has(answer.questionId)) {
        map.set(answer.questionId, QuestionAnswerMapper.toDomain(answer));
      }
    }

    return map;
  }
}
