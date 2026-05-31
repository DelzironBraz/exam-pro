export interface ExceptionsService {
  badRequestException<T>(data: T): never;
  unauthorizedException<T>(data?: T): never;
  notFoundException<T>(data?: T): never;
  conflictException<T>(data?: T): never;
  internalServerErrorException<T>(data?: T): never;
}

export const EXCEPTIONS_SERVICE = Symbol('EXCEPTIONS_SERVICE');
