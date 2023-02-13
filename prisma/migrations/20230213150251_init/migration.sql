/*
  Warnings:

  - Added the required column `itemId` to the `PaymentMethods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethods" ADD COLUMN     "itemId" TEXT NOT NULL;
