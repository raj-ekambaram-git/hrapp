-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "itemId" DROP NOT NULL,
ALTER COLUMN "processCustomerId" DROP NOT NULL,
ALTER COLUMN "processorPaymentId" DROP NOT NULL,
ALTER COLUMN "processorToken" DROP NOT NULL;
