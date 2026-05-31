import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export class DeleteUserUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteUserUseCase.name, `Deleting user: ${id}`);

    const existing = await this.userRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({
        message: 'User not found',
      });
    }

    await this.userRepository.delete(id);
  }
}
