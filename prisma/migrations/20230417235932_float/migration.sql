-- AlterTable
ALTER TABLE "peer_review_assignments" ALTER COLUMN "final_score" SET DEFAULT 0,
ALTER COLUMN "final_score" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "peer_review_responses" ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "peer_review_submissions" ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;
