import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export class ListExamsByGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(groupId: string): Promise<ExamEntity[]> {
    this.logger.log(ListExamsByGroupUseCase.name, `Listing exams for group ${groupId}`);

    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    return this.examsRepository.findManyByGroup(groupId);
  }
}
