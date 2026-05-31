import { Injectable } from '@nestjs/common';
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

  async findMany(filters?: FindGroupsFilters): Promise<GroupEntity[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        type: filters?.type,
        visibility: filters?.visibility,
        ownerId: filters?.ownerId,
      },
      orderBy: { createdAt: 'desc' },
    });
    return groups.map(GroupMapper.toDomain);
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
