import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';
import { SimulationMapper } from '../prisma/simulation.mapper';

@Injectable()
export class PrismaSimulationsRepository
  extends PrismaRepository
  implements SimulationsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(simulation: SimulationEntity): Promise<SimulationEntity> {
    const created = await this.prisma.simulation.create({
      data: {
        id: simulation.id,
        title: simulation.title,
        description: simulation.description,
        groupId: simulation.groupId,
        timerMode: simulation.timerMode,
        durationMinutes: simulation.durationMinutes,
        createdBy: simulation.createdBy,
        createdAt: simulation.createdAt,
      },
    });
    return SimulationMapper.toDomain(created);
  }

  async findById(id: string): Promise<SimulationEntity | null> {
    const simulation = await this.prisma.simulation.findUnique({ where: { id } });
    return simulation ? SimulationMapper.toDomain(simulation) : null;
  }

  async update(simulation: SimulationEntity): Promise<SimulationEntity> {
    const updated = await this.prisma.simulation.update({
      where: { id: simulation.id },
      data: {
        title: simulation.title,
        description: simulation.description,
        timerMode: simulation.timerMode,
        durationMinutes: simulation.durationMinutes,
      },
    });
    return SimulationMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.simulation.delete({ where: { id } });
  }

  async findManyByGroup(
    groupId: string,
    pagination: PaginationParams,
  ): Promise<SimulationEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const simulations = await this.prisma.simulation.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    return simulations.map(SimulationMapper.toDomain);
  }

  async countByGroup(groupId: string): Promise<number> {
    return this.prisma.simulation.count({ where: { groupId } });
  }

  async setQuestions(simulationId: string, questionIds: string[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.simulationQuestion.deleteMany({ where: { simulationId } });

      await tx.simulationQuestion.createMany({
        data: questionIds.map((questionId, index) => ({
          simulationId,
          questionId,
          sortOrder: index,
        })),
      });
    });
  }

  async findQuestionIds(simulationId: string): Promise<string[]> {
    const rows = await this.prisma.simulationQuestion.findMany({
      where: { simulationId },
      orderBy: { sortOrder: 'asc' },
      select: { questionId: true },
    });
    return rows.map((row) => row.questionId);
  }
}
