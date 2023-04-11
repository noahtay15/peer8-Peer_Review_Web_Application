/*
  Warnings:

  - You are about to drop the column `code` on the `classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "code";

-- CreateTable
CREATE TABLE "peer_review_responses" (
    "id" SERIAL NOT NULL,
    "peer_review_assignment_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "score" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peer_review_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peer_review_responses" ADD CONSTRAINT "peer_review_responses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_review_responses" ADD CONSTRAINT "peer_review_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_review_responses" ADD CONSTRAINT "peer_review_responses_peer_review_assignment_id_fkey" FOREIGN KEY ("peer_review_assignment_id") REFERENCES "peer_review_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
