-- DropForeignKey
ALTER TABLE "peer_review_submissions" DROP CONSTRAINT "fk_peer_review_assignment_id_2";

-- AddForeignKey
ALTER TABLE "peer_review_submissions" ADD CONSTRAINT "fk_peer_review_assignment_id_2" FOREIGN KEY ("peer_review_assignment_id") REFERENCES "peer_review_assignments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
