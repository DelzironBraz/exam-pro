-- AlterTable
ALTER TABLE "questions" ADD COLUMN "type" VARCHAR(20) NOT NULL DEFAULT 'multiple_choice';
ALTER TABLE "questions" ADD COLUMN "reference_answer" TEXT;

-- AlterTable
ALTER TABLE "question_answers" ALTER COLUMN "selected_alternative_id" DROP NOT NULL;
ALTER TABLE "question_answers" ADD COLUMN "text_answer" TEXT;
ALTER TABLE "question_answers" ADD COLUMN "similarity_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "exam_attempt_answers" ALTER COLUMN "selected_alternative_id" DROP NOT NULL;
ALTER TABLE "exam_attempt_answers" ADD COLUMN "text_answer" TEXT;
ALTER TABLE "exam_attempt_answers" ADD COLUMN "similarity_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "simulation_attempt_answers" ALTER COLUMN "selected_alternative_id" DROP NOT NULL;
ALTER TABLE "simulation_attempt_answers" ADD COLUMN "text_answer" TEXT;
ALTER TABLE "simulation_attempt_answers" ADD COLUMN "similarity_score" DOUBLE PRECISION;

-- Questões sem alternativas passam a ser discursivas.
-- Usa explanation como gabarito quando disponível; caso contrário, o enunciado.
UPDATE "questions" q
SET
  "type" = 'discursive',
  "reference_answer" = COALESCE(NULLIF(TRIM(q."explanation"), ''), q."statement")
WHERE NOT EXISTS (
  SELECT 1 FROM "alternatives" a WHERE a."question_id" = q."id"
);
