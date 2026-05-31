import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';
import { TagsRepository } from '../../../tags/domain/repositories/tags.repository';
import { GroupsRepository } from '../../domain/repositories/groups.repository';
import { buildUniqueSlug } from '../utils/slug.util';

export interface CreateGroupInput {
  name: string;
  description?: string;
  type: GroupType;
  visibility: GroupVisibility;
  ownerId: string;
  tags?: string[];
}

export class CreateGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupsRepository: GroupsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateGroupInput): Promise<GroupEntity> {
    this.logger.log(CreateGroupUseCase.name, `Creating group: ${input.name}`);

    const slug = await buildUniqueSlug(input.name, async (candidate) => {
      const existing = await this.groupsRepository.findBySlug(candidate);
      return existing !== null;
    });

    const now = new Date();
    const group = new GroupEntity(
      randomUUID(),
      input.name,
      slug,
      input.description ?? null,
      input.type,
      input.visibility,
      input.ownerId,
      now,
      now,
    );

    const created = await this.groupsRepository.create(group);

    if (input.tags?.length) {
      await this.tagsRepository.syncGroupTags(created.id, input.tags);
    }

    return created;
  }
}
