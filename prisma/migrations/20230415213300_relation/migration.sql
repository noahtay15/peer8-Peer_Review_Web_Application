-- CreateTable
CREATE TABLE "_peer_review_groupsTousers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_peer_review_groupsTousers_AB_unique" ON "_peer_review_groupsTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_peer_review_groupsTousers_B_index" ON "_peer_review_groupsTousers"("B");

-- AddForeignKey
ALTER TABLE "_peer_review_groupsTousers" ADD CONSTRAINT "_peer_review_groupsTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "peer_review_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_peer_review_groupsTousers" ADD CONSTRAINT "_peer_review_groupsTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
