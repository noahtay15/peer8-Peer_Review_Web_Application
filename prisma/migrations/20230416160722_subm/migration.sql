-- AlterTable
ALTER TABLE "peer_review_responses" ADD COLUMN     "peer_review_submission_id" INTEGER;

-- AddForeignKey
ALTER TABLE "peer_review_responses" ADD CONSTRAINT "fk_peer_review_submission_id" FOREIGN KEY ("peer_review_submission_id") REFERENCES "peer_review_submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
