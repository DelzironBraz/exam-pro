import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { OCRProvider } from '../../domain/providers/ocr.provider';
import { LocalPdfStorageService } from '../storage/local-pdf-storage.service';

// pdf-parse é CJS; import dinâmico evita problemas com Nest/webpack
type PdfParseFn = (buffer: Buffer) => Promise<{ text: string }>;

@Injectable()
export class PdfParseOCRProvider implements OCRProvider {
  constructor(private readonly storage: LocalPdfStorageService) {}

  async extractText(fileUrl: string): Promise<string> {
    const filePath = this.storage.resolvePath(fileUrl);
    const buffer = await readFile(filePath);

    const pdfParse = (await import('pdf-parse')).default as unknown as PdfParseFn;
    const result = await pdfParse(buffer);

    const text = result.text?.trim() ?? '';
    if (!text) {
      throw new Error('No text could be extracted from the PDF');
    }

    return text;
  }
}
