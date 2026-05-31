import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { ExamAttemptAnswerEntity } from '../../domain/entities/exam-attempt-answer.entity';
import { ExamAttemptAnswersRepository } from '../../domain/repositories/exam-attempt-answers.repository';
import { ExamAttemptAnswerMapper } from '../prisma/exam-attempt-answer.mapper';

@Injectable()
export class PrismaExamAttemptAnswersRepository
  extends PrismaRepository
  implements ExamAttemptAnswersRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async upsert(answer: ExamAttemptAnswerEntity): Promise<ExamAttemptAnswerEntity> {
    const saved = await this.prisma.examAttemptAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId: answer.attemptId,
          questionId: answer.questionId,
        },
      },
      create: {
        id: answer.id,
        attemptId: answer.attemptId,
        questionId: answer.questionId,
        selectedAlternativeId: answer.selectedAlternativeId,
        timeSpentSeconds: answer.timeSpentSeconds,
        isCorrect: answer.isCorrect,
        answeredAt: answer.answeredAt,
      },
      update: {
        selectedAlternativeId: answer.selectedAlternativeId,
        timeSpentSeconds: answer.timeSpentSeconds,
        isCorrect: answer.isCorrect,
        answeredAt: answer.answeredAt,
      },
    });
    return ExamAttemptAnswerMapper.toDomain(saved);
  }

  async findByAttemptId(attemptId: string): Promise<ExamAttemptAnswerEntity[]> {
    const answers = await this.prisma.examAttemptAnswer.findMany({
      where: { attemptId },
      orderBy: { answeredAt: 'asc' },
    });
    return answers.map(ExamAttemptAnswerMapper.toDomain);
  }

  async countByAttemptId(attemptId: string): Promise<{
    correct: number;
    wrong: number;
    totalTimeSeconds: number;
  }> {
    const answers = await this.prisma.examAttemptAnswer.findMany({
      where: { attemptId },
    });

    return {
      correct: answers.filter((a) => a.isCorrect).length,
      wrong: answers.filter((a) => !a.isCorrect).length,
      totalTimeSeconds: answers.reduce((sum, a) => sum + a.timeSpentSeconds, 0),
    };
  }
}
