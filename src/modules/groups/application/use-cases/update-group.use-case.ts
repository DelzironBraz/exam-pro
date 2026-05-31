import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';
import { GroupsRepository } from '../../domain/repositories/groups.repository';
import { buildUniqueSlug, slugify } from '../utils/slug.util';

export interface UpdateGroupInput {
  groupId: string;
  name?: string;
  description?: string;
  visibility?: GroupVisibility;
}

export class UpdateGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: UpdateGroupInput): Promise<GroupEntity> {
    this.logger.log(UpdateGroupUseCase.name, `Updating group: ${input.groupId}`);

    const existing = await this.groupsRepository.findById(input.groupId);
    if (!existing) {
      this.exceptionsService.notFoundException({
        message: 'Group not found',
      });
    }

    const name = input.name ?? existing.name;
    let slug = existing.slug;

    if (input.name && slugify(input.name) !== slugify(existing.name)) {
      slug = await buildUniqueSlug(input.name, async (candidate) => {
        if (candidate === existing.slug) {
          return false;
        }
        const found = await this.groupsRepository.findBySlug(candidate);
        return found !== null;
      });
    }

    const updated = new GroupEntity(
      existing.id,
      name,
      slug,
      input.description !== undefined ? input.description : existing.description,
      existing.type,
      input.visibility ?? existing.visibility,
      existing.ownerId,
      existing.createdAt,
      new Date(),
    );

    return this.groupsRepository.update(updated);
  }
}
