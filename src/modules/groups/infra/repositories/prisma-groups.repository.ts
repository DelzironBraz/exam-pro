import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { GroupEntity } from '../../domain/entities/group.entity';
import {
  FindGroupsFilters,
  GroupsRepository,
} from '../../domain/repositories/groups.repository';
import { GroupMapper } from '../prisma/group.mapper';

@Injectable()
export class PrismaGroupsRepository
  extends PrismaRepository
  implements GroupsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(group: GroupEntity): Promise<GroupEntity> {
    const created = await this.prisma.group.create({
      data: {
        id: group.id,
        name: group.name,
        slug: group.slug,
        description: group.description,
        type: group.type,
        visibility: group.visibility,
        ownerId: group.ownerId,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      },
    });
    return GroupMapper.toDomain(created);
  }

  async findById(id: string): Promise<GroupEntity | null> {
    const group = await this.prisma.group.findUnique({ where: { id } });
    return group ? GroupMapper.toDomain(group) : null;
  }

  async findBySlug(slug: string): Promise<GroupEntity | null> {
    const group = await this.prisma.group.findUnique({ where: { slug } });
    return group ? GroupMapper.toDomain(group) : null;
  }

  async findMany(
    filters: FindGroupsFilters | undefined,
    pagination: PaginationParams,
  ): Promise<GroupEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const groups = await this.prisma.group.findMany({
      where: this.buildWhere(filters),
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    return groups.map(GroupMapper.toDomain);
  }

  async count(filters?: FindGroupsFilters): Promise<number> {
    return this.prisma.group.count({
      where: this.buildWhere(filters),
    });
  }

  private buildWhere(filters?: FindGroupsFilters) {
    return {
      type: filters?.type,
      visibility: filters?.visibility,
      ownerId: filters?.ownerId,
    };
  }

  async update(group: GroupEntity): Promise<GroupEntity> {
    const updated = await this.prisma.group.update({
      where: { id: group.id },
      data: {
        name: group.name,
        slug: group.slug,
        description: group.description,
        visibility: group.visibility,
        updatedAt: group.updatedAt,
      },
    });
    return GroupMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.group.delete({ where: { id } });
  }
}
