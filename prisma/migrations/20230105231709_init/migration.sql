/*
  Warnings:

  - You are about to drop the column `type` on the `InvoiceTransaction` table. All the data in the column will be lost.
  - Added the required column `status` to the `InvoiceTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceTransactionStatus" AS ENUM ('Pending', 'Paid', 'Refund', 'Cancelled');

-- AlterTable
ALTER TABLE "InvoiceTransaction" DROP COLUMN "type",
ADD COLUMN     "status" "InvoiceTransactionStatus" NOT NULL;

-- DropEnum
DROP TYPE "InvoiceTransactionType";
