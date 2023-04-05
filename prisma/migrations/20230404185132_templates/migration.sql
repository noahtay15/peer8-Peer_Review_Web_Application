/*
  Warnings:

  - Added the required column `status` to the `peer_review_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "peer_review_assignments" ADD COLUMN     "final_score" INTEGER DEFAULT 0,
ADD COLUMN     "status" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "peer_review_submissions" ADD COLUMN     "score" INTEGER;

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "creator_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "fk_creator_id" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
