/*
  Warnings:

  - Added the required column `processCustomerId` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processorPaymentId` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processorToken` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "processCustomerId" TEXT NOT NULL,
ADD COLUMN     "processorPaymentId" TEXT NOT NULL,
ADD COLUMN     "processorToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountOwner" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "User_accountId_accountOwner_idx" ON "User"("accountId", "accountOwner");
