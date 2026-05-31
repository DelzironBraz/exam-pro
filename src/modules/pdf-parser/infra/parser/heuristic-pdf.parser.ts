import { Injectable } from '@nestjs/common';
import { ParsedAlternativeEntity } from '../../domain/entities/parsed-alternative.entity';
import { ParsedQuestionEntity } from '../../domain/entities/parsed-question.entity';
import {
  ParsedStudyPlanEntity,
  ParsedStudyPlanItemEntity,
} from '../../domain/entities/parsed-study-plan.entity';
import { PDFParser } from '../../domain/providers/pdf-parser.provider';

const QUESTION_START = /^(?:quest(?:ão|ao)\s*)?(\d{1,3})[\).:\-]\s*/i;
const ALTERNATIVE_LINE = /^([A-Ea-e])[\).:\-\)]\s*(.+)$/;
const CORRECT_MARKERS = /(\(correta\)|\*|✓|CORRETA)/i;
const STUDY_ITEM_LINE = /^[-•*]\s*(.+)$/;

@Injectable()
export class HeuristicPdfParser implements PDFParser {
  async parseExam(content: string): Promise<ParsedQuestionEntity[]> {
    const blocks = this.splitQuestionBlocks(content);
    const questions: ParsedQuestionEntity[] = [];

    for (const block of blocks) {
      const parsed = this.parseQuestionBlock(block);
      if (parsed) {
        questions.push(parsed);
      }
    }

    return questions;
  }

  async parseStudyPlan(content: string): Promise<ParsedStudyPlanEntity> {
    const lines = content
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const titleLine =
      lines.find((l) => /^plano\s+de\s+estudo/i.test(l)) ?? lines[0] ?? 'Plano importado';

    const items: ParsedStudyPlanItemEntity[] = [];

    for (const line of lines) {
      const match = line.match(STUDY_ITEM_LINE);
      if (match) {
        const text = match[1].trim();
        items.push(
          new ParsedStudyPlanItemEntity(
            text.slice(0, 120),
            text,
            this.extractHoursFromText(text) ?? 2,
          ),
        );
      }
    }

    if (items.length === 0) {
      items.push(
        new ParsedStudyPlanItemEntity(
          'Conteúdo importado do PDF',
          'Revise o texto extraído e ajuste os itens manualmente.',
          4,
        ),
      );
    }

    return new ParsedStudyPlanEntity(titleLine.replace(/^plano\s+de\s+estudo:?\s*/i, '').trim(), items);
  }

  private splitQuestionBlocks(content: string): string[] {
    const lines = content.split('\n');
    const blocks: string[] = [];
    let current: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      if (QUESTION_START.test(trimmed) && current.length > 0) {
        blocks.push(current.join('\n'));
        current = [trimmed];
        continue;
      }

      current.push(trimmed);
    }

    if (current.length > 0) {
      blocks.push(current.join('\n'));
    }

    if (blocks.length === 0 && content.trim()) {
      return [content.trim()];
    }

    return blocks;
  }

  private parseQuestionBlock(block: string): ParsedQuestionEntity | null {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      return null;
    }

    const statementLines: string[] = [];
    const alternatives: ParsedAlternativeEntity[] = [];

    for (const line of lines) {
      const altMatch = line.match(ALTERNATIVE_LINE);
      if (altMatch) {
        const label = altMatch[1].toUpperCase();
        let contentText = altMatch[2].trim();
        const isCorrect = CORRECT_MARKERS.test(contentText);
        contentText = contentText.replace(CORRECT_MARKERS, '').trim();

        alternatives.push(new ParsedAlternativeEntity(label, contentText, isCorrect));
        continue;
      }

      if (alternatives.length === 0) {
        const cleaned = line.replace(QUESTION_START, '').trim();
        if (cleaned) {
          statementLines.push(cleaned);
        }
      }
    }

    const statement = statementLines.join(' ').trim();
    if (!statement || alternatives.length < 2) {
      return null;
    }

    if (!alternatives.some((a) => a.isCorrect)) {
      alternatives[0] = new ParsedAlternativeEntity(
        alternatives[0].label,
        alternatives[0].content,
        true,
      );
    }

    return new ParsedQuestionEntity(statement, alternatives);
  }

  private extractHoursFromText(text: string): number | null {
    const match = text.match(/(\d+)\s*h(?:oras?)?/i);
    return match ? Number.parseInt(match[1], 10) : null;
  }
}
