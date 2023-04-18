/*
  Warnings:

  - You are about to drop the `_peer_review_groupsTousers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_peer_review_groupsTousers" DROP CONSTRAINT "_peer_review_groupsTousers_A_fkey";

-- DropForeignKey
ALTER TABLE "_peer_review_groupsTousers" DROP CONSTRAINT "_peer_review_groupsTousers_B_fkey";

-- DropTable
DROP TABLE "_peer_review_groupsTousers";
