import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';
import { GroupsRepository } from '../../domain/repositories/groups.repository';

export interface ListGroupsInput {
  type?: GroupType;
  visibility?: GroupVisibility;
  ownerId?: string;
}

export class ListGroupsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async execute(input?: ListGroupsInput): Promise<GroupEntity[]> {
    this.logger.log(ListGroupsUseCase.name, 'Listing groups');
    return this.groupsRepository.findMany(input);
  }
}
