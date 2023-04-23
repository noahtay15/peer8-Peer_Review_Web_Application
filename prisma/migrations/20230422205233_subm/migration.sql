-- DropForeignKey
ALTER TABLE "peer_review_scores" DROP CONSTRAINT "fk_submission_id";

-- AddForeignKey
ALTER TABLE "peer_review_scores" ADD CONSTRAINT "fk_submission_id" FOREIGN KEY ("submission_id") REFERENCES "peer_review_submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
