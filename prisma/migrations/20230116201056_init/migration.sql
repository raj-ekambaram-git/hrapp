-- AlterEnum
ALTER TYPE "ExpenseType" ADD VALUE 'Cost';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "expenseBudget" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "usedExpenseBudget" DECIMAL(65,30) DEFAULT 0;
