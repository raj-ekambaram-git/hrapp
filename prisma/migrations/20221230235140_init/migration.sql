/*
  Warnings:

  - A unique constraint covering the columns `[projectId,userId]` on the table `ProjectResource` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "remainingBudget" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectResource_projectId_userId_key" ON "ProjectResource"("projectId", "userId");
