import * as bcrypt from 'bcrypt';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  avatarUrl?: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<User> {
    this.logger.log(UpdateUserUseCase.name, `Updating user: ${id}`);

    const existing = await this.userRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({
        message: 'User not found',
      });
    }

    if (input.email && input.email !== existing.email) {
      const emailTaken = await this.userRepository.findByEmail(input.email);
      if (emailTaken) {
        this.exceptionsService.conflictException({
          message: 'Email already registered',
        });
      }
    }

    let passwordHash: string | undefined;
    if (input.password) {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    return this.userRepository.update(id, {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      avatarUrl: input.avatarUrl,
    });
  }
}
