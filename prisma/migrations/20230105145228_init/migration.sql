/*
  Warnings:

  - You are about to drop the column `notes` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Invoice` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InvoiceTransactionType" AS ENUM ('Pending', 'Paid', 'Refund', 'Cancelled');

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "notes",
DROP COLUMN "transactionId";

-- CreateTable
CREATE TABLE "InvoiceTransaction" (
    "id" SERIAL NOT NULL,
    "type" "InvoiceTransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transactionData" TEXT NOT NULL,
    "invoiceId" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvoiceTransaction" ADD CONSTRAINT "InvoiceTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
