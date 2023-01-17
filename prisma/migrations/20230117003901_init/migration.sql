-- AlterEnum
ALTER TYPE "ExpenseStatus" ADD VALUE 'Saved';

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "ExpenseEntry" ADD COLUMN     "notes" TEXT;
