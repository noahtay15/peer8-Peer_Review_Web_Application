-- AlterTable
ALTER TABLE "peer_review_scores" ADD COLUMN     "submission_id" INTEGER;

-- AddForeignKey
ALTER TABLE "peer_review_scores" ADD CONSTRAINT "fk_submission_id" FOREIGN KEY ("submission_id") REFERENCES "peer_review_submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
