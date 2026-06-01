import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export interface ListUsersInput {
  page?: number;
  limit?: number;
}

export class GetUsersUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input?: ListUsersInput): Promise<PaginatedResult<User>> {
    this.logger.log(GetUsersUseCase.name, 'Listing users');

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.userRepository.findMany(pagination),
      this.userRepository.count(),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
