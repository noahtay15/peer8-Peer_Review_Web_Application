-- DropForeignKey
ALTER TABLE "peer_review_assignments" DROP CONSTRAINT "fk_group_id";

-- AddForeignKey
ALTER TABLE "peer_review_assignments" ADD CONSTRAINT "fk_group_id" FOREIGN KEY ("group_id") REFERENCES "peer_review_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
