export abstract class OCRProvider {
  abstract extractText(fileUrl: string): Promise<string>;
}

export const OCR_PROVIDER = Symbol('OCR_PROVIDER');
