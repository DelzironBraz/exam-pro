import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../dto/pagination-query.dto';
import { PaginatedResult, PaginationParams } from '../types/pagination.types';

export function resolvePagination(input?: {
  page?: number;
  limit?: number;
}): PaginationParams {
  return {
    page: input?.page ?? DEFAULT_PAGE,
    limit: input?.limit ?? DEFAULT_LIMIT,
  };
}

export function toPrismaPagination({ page, limit }: PaginationParams): {
  skip: number;
  take: number;
} {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  pagination: PaginationParams,
): PaginatedResult<T> {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pagination.limit);

  return {
    items,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages,
  };
}

export function paginateInMemory<T>(
  items: T[],
  pagination: PaginationParams,
): PaginatedResult<T> {
  const { skip, take } = toPrismaPagination(pagination);
  return buildPaginatedResult(items.slice(skip, skip + take), items.length, pagination);
}
