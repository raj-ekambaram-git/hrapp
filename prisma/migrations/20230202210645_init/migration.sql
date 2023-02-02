/*
  Warnings:

  - You are about to drop the column `templateName` on the `ExportTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExportTemplate" DROP COLUMN "templateName",
ADD COLUMN     "template" TEXT;
