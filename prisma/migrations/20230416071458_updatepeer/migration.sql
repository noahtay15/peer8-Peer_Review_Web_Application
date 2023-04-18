-- AlterTable
ALTER TABLE "peer_review_submissions" ADD COLUMN     "peer_review_id" INTEGER;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_id_3" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
