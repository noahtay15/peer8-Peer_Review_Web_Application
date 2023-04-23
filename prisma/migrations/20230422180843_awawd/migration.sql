-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_peer_review_group_id";

-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_peer_review_id_3";

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_group_id" FOREIGN KEY ("peer_review_group_id") REFERENCES "peer_review_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_id_3" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
