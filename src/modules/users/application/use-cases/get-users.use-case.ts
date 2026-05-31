import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export class GetUsersUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    this.logger.log(GetUsersUseCase.name, 'Listing all users');
    return this.userRepository.findAll();
  }
}
