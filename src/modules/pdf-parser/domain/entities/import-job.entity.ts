import { ImportStatus } from '../enums/import-status.enum';
import { ImportType } from '../enums/import-type.enum';

export class ImportJobEntity {
  constructor(
    readonly id: string,
    readonly uploadedBy: string,
    readonly fileUrl: string,
    readonly status: ImportStatus,
    readonly type: ImportType,
    readonly createdAt: Date,
    readonly rawText?: string | null,
    readonly parsedPayload?: unknown | null,
    readonly errorMessage?: string | null,
    readonly approvedRefId?: string | null,
  ) {}
}
