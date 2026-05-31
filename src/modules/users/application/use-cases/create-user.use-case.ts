import * as bcrypt from 'bcrypt';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role?: string;
  avatarUrl?: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    this.logger.log(CreateUserUseCase.name, `Creating user: ${input.email}`);

    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      this.exceptionsService.conflictException({
        message: 'Email already registered',
      });
    }

    let passwordHash: string | null = null;
    if (input.password) {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      avatarUrl: input.avatarUrl ?? null,
    });
  }
}
