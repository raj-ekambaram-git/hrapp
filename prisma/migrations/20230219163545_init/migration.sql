/*
  Warnings:

  - You are about to drop the column `poNumber` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('Created', 'Active', 'Inactive');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "poNumber";

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL DEFAULT 0,
    "number" TEXT NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
