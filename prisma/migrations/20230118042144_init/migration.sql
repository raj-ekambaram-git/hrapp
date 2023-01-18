/*
  Warnings:

  - You are about to drop the column `expenseBudget` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `usedExpenseBudget` on the `Project` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvoiceItemType" ADD VALUE 'Expense';
ALTER TYPE "InvoiceItemType" ADD VALUE 'Misc';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvoiceType" ADD VALUE 'Expense';
ALTER TYPE "InvoiceType" ADD VALUE 'Misc';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "expenseBudget",
DROP COLUMN "usedExpenseBudget",
ADD COLUMN     "miscBudget" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "usedMiscBudget" DECIMAL(65,30) DEFAULT 0;
