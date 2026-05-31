import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LocalPdfStorageService {
  private readonly baseDir = join(process.cwd(), 'uploads', 'pdf');

  async saveUploadedFile(jobId: string, buffer: Buffer, originalName: string): Promise<string> {
    await mkdir(this.baseDir, { recursive: true });

    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${jobId}-${safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`}`;
    const absolutePath = join(this.baseDir, fileName);

    await writeFile(absolutePath, buffer);

    return absolutePath;
  }

  resolvePath(fileUrl: string): string {
    if (fileUrl.startsWith('/') || fileUrl.includes(':\\')) {
      return fileUrl;
    }
    return join(process.cwd(), fileUrl);
  }
}
