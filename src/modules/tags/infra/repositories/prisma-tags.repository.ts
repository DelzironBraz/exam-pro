import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { normalizeTagName } from '../../application/utils/normalize-tag-name.util';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { TagMapper } from '../prisma/tag.mapper';

@Injectable()
export class PrismaTagsRepository
  extends PrismaRepository
  implements TagsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(name: string): Promise<TagEntity> {
    const normalized = this.requireNormalizedName(name);

    const tag = await this.prisma.tag.upsert({
      where: { name: normalized },
      create: { name: normalized },
      update: {},
    });

    return TagMapper.toDomain(tag);
  }

  async findById(id: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    return tag ? TagMapper.toDomain(tag) : null;
  }

  async findByName(name: string): Promise<TagEntity | null> {
    const normalized = normalizeTagName(name);
    if (!normalized) {
      return null;
    }

    const tag = await this.prisma.tag.findUnique({ where: { name: normalized } });
    return tag ? TagMapper.toDomain(tag) : null;
  }

  async findMany(pagination: PaginationParams): Promise<TagEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      skip,
      take,
    });
    return tags.map(TagMapper.toDomain);
  }

  async count(): Promise<number> {
    return this.prisma.tag.count();
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({ where: { id } });
  }

  async attachToQuestion(tagId: string, questionId: string): Promise<void> {
    await this.prisma.questionTag.upsert({
      where: {
        questionId_tagId: { questionId, tagId },
      },
      create: { questionId, tagId },
      update: {},
    });
  }

  async attachToGroup(tagId: string, groupId: string): Promise<void> {
    await this.prisma.groupTag.upsert({
      where: {
        groupId_tagId: { groupId, tagId },
      },
      create: { groupId, tagId },
      update: {},
    });
  }

  async detachFromQuestion(tagId: string, questionId: string): Promise<void> {
    await this.prisma.questionTag.deleteMany({
      where: { questionId, tagId },
    });
  }

  async detachFromGroup(tagId: string, groupId: string): Promise<void> {
    await this.prisma.groupTag.deleteMany({
      where: { groupId, tagId },
    });
  }

  async syncQuestionTags(questionId: string, tagNames: string[]): Promise<void> {
    const normalized = this.normalizeTagNames(tagNames);

    await this.prisma.$transaction(async (tx) => {
      await tx.questionTag.deleteMany({ where: { questionId } });

      for (const name of normalized) {
        const tag = await tx.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        });

        await tx.questionTag.create({
          data: { questionId, tagId: tag.id },
        });
      }
    });
  }

  async syncGroupTags(groupId: string, tagNames: string[]): Promise<void> {
    const normalized = this.normalizeTagNames(tagNames);

    await this.prisma.$transaction(async (tx) => {
      await tx.groupTag.deleteMany({ where: { groupId } });

      for (const name of normalized) {
        const tag = await tx.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        });

        await tx.groupTag.create({
          data: { groupId, tagId: tag.id },
        });
      }
    });
  }

  async findNamesByQuestionId(questionId: string): Promise<string[]> {
    const tags = await this.findAllByQuestionId(questionId);
    return tags.map((tag) => tag.name);
  }

  async findNamesByGroupId(groupId: string): Promise<string[]> {
    const tags = await this.findAllByGroupId(groupId);
    return tags.map((tag) => tag.name);
  }

  async findAllByQuestionId(questionId: string): Promise<TagEntity[]> {
    const links = await this.prisma.questionTag.findMany({
      where: { questionId },
      include: { tag: true },
      orderBy: { tag: { name: 'asc' } },
    });
    return links.map((link) => TagMapper.toDomain(link.tag));
  }

  async findByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<TagEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const links = await this.prisma.questionTag.findMany({
      where: { questionId },
      include: { tag: true },
      orderBy: { tag: { name: 'asc' } },
      skip,
      take,
    });
    return links.map((link) => TagMapper.toDomain(link.tag));
  }

  async countByQuestionId(questionId: string): Promise<number> {
    return this.prisma.questionTag.count({ where: { questionId } });
  }

  async findAllByGroupId(groupId: string): Promise<TagEntity[]> {
    const links = await this.prisma.groupTag.findMany({
      where: { groupId },
      include: { tag: true },
      orderBy: { tag: { name: 'asc' } },
    });
    return links.map((link) => TagMapper.toDomain(link.tag));
  }

  async findByGroupId(
    groupId: string,
    pagination: PaginationParams,
  ): Promise<TagEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const links = await this.prisma.groupTag.findMany({
      where: { groupId },
      include: { tag: true },
      orderBy: { tag: { name: 'asc' } },
      skip,
      take,
    });
    return links.map((link) => TagMapper.toDomain(link.tag));
  }

  async countByGroupId(groupId: string): Promise<number> {
    return this.prisma.groupTag.count({ where: { groupId } });
  }

  private normalizeTagNames(tagNames: string[]): string[] {
    return [
      ...new Set(
        tagNames.map((name) => normalizeTagName(name)).filter(Boolean),
      ),
    ] as string[];
  }

  private requireNormalizedName(name: string): string {
    const normalized = normalizeTagName(name);
    if (!normalized) {
      throw new Error('Tag name is required');
    }
    return normalized;
  }
}
