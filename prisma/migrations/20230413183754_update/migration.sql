/*
  Warnings:

  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "fk_peer_review_assignment_id";

-- AlterTable
ALTER TABLE "peer_review_assignments" ADD COLUMN     "comments" TEXT;

-- AlterTable
ALTER TABLE "peer_review_responses" ADD COLUMN     "comments" TEXT;

-- AlterTable
ALTER TABLE "peer_reviews" ADD COLUMN     "status" VARCHAR(255) NOT NULL DEFAULT 'assigned';

-- DropTable
DROP TABLE "groups";

-- CreateTable
CREATE TABLE "peer_review_groups" (
    "id" SERIAL NOT NULL,
    "peer_review_assignment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peer_review_groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peer_review_groups" ADD CONSTRAINT "fk_peer_review_assignment_id" FOREIGN KEY ("peer_review_assignment_id") REFERENCES "peer_review_assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
