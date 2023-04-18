/*
  Warnings:

  - Added the required column `name` to the `peer_review_groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "peer_review_groups" ADD COLUMN     "name" VARCHAR(255) NOT NULL;
