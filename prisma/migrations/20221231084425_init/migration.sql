/*
  Warnings:

  - You are about to drop the column `remainingBudget` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "remainingBudget",
ADD COLUMN     "remainingBudgetToAllocate" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "usedBudget" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProjectResource" ADD COLUMN     "remainingBudget" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "usedBudget" DECIMAL(65,30) DEFAULT 0;
