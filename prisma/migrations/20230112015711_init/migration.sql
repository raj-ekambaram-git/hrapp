/*
  Warnings:

  - A unique constraint covering the columns `[projectId,userId,billable]` on the table `ProjectResource` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentTerms" ADD VALUE 'Net7';
ALTER TYPE "PaymentTerms" ADD VALUE 'Net15';

-- DropIndex
DROP INDEX "ProjectResource_projectId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectResource_projectId_userId_billable_key" ON "ProjectResource"("projectId", "userId", "billable");
