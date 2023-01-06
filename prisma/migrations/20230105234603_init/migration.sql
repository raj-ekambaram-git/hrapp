/*
  Warnings:

  - Added the required column `transactionId` to the `InvoiceTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceTransaction" ADD COLUMN     "transactionId" INTEGER NOT NULL;
