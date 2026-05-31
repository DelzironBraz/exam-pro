import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export class GetUserUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<User> {
    this.logger.log(GetUserUseCase.name, `Getting user: ${id}`);

    const user = await this.userRepository.findById(id);
    if (!user) {
      this.exceptionsService.notFoundException({
        message: 'User not found',
      });
    }

    return user;
  }
}
