import { PaginatedResult } from '../../application/types/pagination.types';

export class PaginatedResponse<TItem, TResponse = TItem> {
  items: TResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    result: PaginatedResult<TItem>,
    mapItem: (item: TItem) => TResponse = (item) => item as unknown as TResponse,
  ) {
    this.items = result.items.map(mapItem);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
    this.totalPages = result.totalPages;
  }
}
