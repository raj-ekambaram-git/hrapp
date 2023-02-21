-- AlterEnum
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'Closed';

-- AlterTable
ALTER TABLE "ExpenseTransaction" ADD COLUMN     "externalTransactionID" TEXT[];
