-- CreateTable
CREATE TABLE "peer_review_scores" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "scorerId" INTEGER NOT NULL,

    CONSTRAINT "peer_review_scores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peer_review_scores" ADD CONSTRAINT "peer_review_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_review_scores" ADD CONSTRAINT "peer_review_scores_scorerId_fkey" FOREIGN KEY ("scorerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
