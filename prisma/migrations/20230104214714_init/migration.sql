/*
  Warnings:

  - The `createdBy` column on the `Notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "createdBy",
ADD COLUMN     "createdBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
