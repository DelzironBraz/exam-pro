import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionsService } from '../domain/exceptions/exceptions.interface';

@Injectable()
export class NestExceptionsService implements ExceptionsService {
  badRequestException<T>(data: T): never {
    throw new BadRequestException(data);
  }

  unauthorizedException<T>(data?: T): never {
    throw new UnauthorizedException(data);
  }

  notFoundException<T>(data?: T): never {
    throw new NotFoundException(data);
  }

  conflictException<T>(data?: T): never {
    throw new ConflictException(data);
  }

  internalServerErrorException<T>(data?: T): never {
    throw new InternalServerErrorException(data);
  }
}
