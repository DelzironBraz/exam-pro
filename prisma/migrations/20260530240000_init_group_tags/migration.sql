-- CreateTable
CREATE TABLE "group_tags" (
    "group_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "group_tags_pkey" PRIMARY KEY ("group_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "group_tags" ADD CONSTRAINT "group_tags_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_tags" ADD CONSTRAINT "group_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
