/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `ExpenseTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `InvoiceTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "paymentCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseTransaction_transactionId_key" ON "ExpenseTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceTransaction_transactionId_key" ON "InvoiceTransaction"("transactionId");
