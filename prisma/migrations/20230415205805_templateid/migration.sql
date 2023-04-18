-- AlterTable
ALTER TABLE "peer_reviews" ADD COLUMN     "template_id" INTEGER;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "fk_template_id_2" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
