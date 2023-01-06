/*
  Warnings:

  - A unique constraint covering the columns `[childId]` on the table `Notes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "childId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Notes_childId_key" ON "Notes"("childId");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
