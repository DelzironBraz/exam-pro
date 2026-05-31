-- CreateTable
CREATE TABLE "import_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source" VARCHAR(50) NOT NULL,
    "external_id" VARCHAR(50) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "question_id" UUID,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_sources_source_idx" ON "import_sources"("source");

-- CreateIndex
CREATE UNIQUE INDEX "import_sources_source_external_id_key" ON "import_sources"("source", "external_id");

-- AddForeignKey
ALTER TABLE "import_sources" ADD CONSTRAINT "import_sources_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
