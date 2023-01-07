/*
  Warnings:

  - You are about to drop the column `childId` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserStatus" ADD VALUE 'Approved';
ALTER TYPE "UserStatus" ADD VALUE 'Rejected';
ALTER TYPE "UserStatus" ADD VALUE 'Error';

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_childId_fkey";

-- DropIndex
DROP INDEX "Notes_childId_key";

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "childId";

-- CreateTable
CREATE TABLE "_replies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_replies_AB_unique" ON "_replies"("A", "B");

-- CreateIndex
CREATE INDEX "_replies_B_index" ON "_replies"("B");

-- CreateIndex
CREATE INDEX "Notes_type_typeId_idx" ON "Notes"("type", "typeId");

-- AddForeignKey
ALTER TABLE "_replies" ADD CONSTRAINT "_replies_A_fkey" FOREIGN KEY ("A") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_replies" ADD CONSTRAINT "_replies_B_fkey" FOREIGN KEY ("B") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
