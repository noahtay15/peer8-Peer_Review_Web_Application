-- AlterTable
ALTER TABLE "peer_review_submissions" ADD COLUMN     "peer_review_group_id" INTEGER;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_group_id" FOREIGN KEY ("peer_review_group_id") REFERENCES "peer_review_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
