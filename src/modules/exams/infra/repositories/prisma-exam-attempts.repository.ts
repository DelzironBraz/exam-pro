import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import {
  ExamAttemptsRepository,
  FinishExamInput,
} from '../../domain/repositories/exam-attempts.repository';
import { ExamAttemptMapper } from '../prisma/exam-attempt.mapper';

@Injectable()
export class PrismaExamAttemptsRepository
  extends PrismaRepository
  implements ExamAttemptsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(attempt: ExamAttemptEntity): Promise<ExamAttemptEntity> {
    const created = await this.prisma.examAttempt.create({
      data: {
        id: attempt.id,
        examId: attempt.examId,
        userId: attempt.userId,
        startedAt: attempt.startedAt,
        score: attempt.score,
        totalCorrect: attempt.totalCorrect,
        totalWrong: attempt.totalWrong,
        totalTimeSeconds: attempt.totalTimeSeconds,
      },
    });
    return ExamAttemptMapper.toDomain(created);
  }

  async findById(id: string): Promise<ExamAttemptEntity | null> {
    const attempt = await this.prisma.examAttempt.findUnique({ where: { id } });
    return attempt ? ExamAttemptMapper.toDomain(attempt) : null;
  }

  async finish(attemptId: string, result: FinishExamInput): Promise<ExamAttemptEntity> {
    const updated = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        finishedAt: new Date(),
        score: result.score,
        totalCorrect: result.totalCorrect,
        totalWrong: result.totalWrong,
        totalTimeSeconds: result.totalTimeSeconds,
      },
    });
    return ExamAttemptMapper.toDomain(updated);
  }

  async findByUser(userId: string): Promise<ExamAttemptEntity[]> {
    const attempts = await this.prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
    });
    return attempts.map(ExamAttemptMapper.toDomain);
  }

  async findByUserAndExam(userId: string, examId: string): Promise<ExamAttemptEntity[]> {
    const attempts = await this.prisma.examAttempt.findMany({
      where: { userId, examId },
      orderBy: { startedAt: 'desc' },
    });
    return attempts.map(ExamAttemptMapper.toDomain);
  }
}
