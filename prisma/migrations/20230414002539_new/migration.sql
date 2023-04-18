/*
  Warnings:

  - You are about to drop the column `peer_review_assignment_id` on the `peer_review_groups` table. All the data in the column will be lost.
  - Added the required column `peer_review_id` to the `peer_review_groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "peer_review_groups" DROP CONSTRAINT "fk_peer_review_assignment_id";

-- AlterTable
ALTER TABLE "peer_review_assignments" ADD COLUMN     "group_id" INTEGER;

-- AlterTable
ALTER TABLE "peer_review_groups" DROP COLUMN "peer_review_assignment_id",
ADD COLUMN     "peer_review_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "peer_review_assignments" ADD CONSTRAINT "fk_group_id" FOREIGN KEY ("group_id") REFERENCES "peer_review_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "peer_review_groups" ADD CONSTRAINT "fk_peer_review_id_2" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
