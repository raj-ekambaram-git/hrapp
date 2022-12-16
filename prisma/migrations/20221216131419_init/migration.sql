/*
  Warnings:

  - You are about to drop the column `cycle` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currency` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uom` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('hours', 'item');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR');

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_vendorId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "cycle",
DROP COLUMN "quantity",
DROP COLUMN "rate",
ADD COLUMN     "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projectId" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "currency" "Currency" NOT NULL,
ADD COLUMN     "uom" "UnitOfMeasure" NOT NULL;

-- DropTable
DROP TABLE "Resource";

-- CreateTable
CREATE TABLE "ProjectResource" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER DEFAULT 1,
    "userId" INTEGER DEFAULT 1,
    "unitPrice" DECIMAL(65,30),
    "currency" "Currency",
    "quantity" INTEGER,
    "uom" "UnitOfMeasure",
    "budgetAllocated" DECIMAL(65,30) DEFAULT 0,

    CONSTRAINT "ProjectResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "InvoiceItemType" NOT NULL,
    "invoiceCycle" "InvoiceItemType" NOT NULL,
    "addressId" INTEGER NOT NULL DEFAULT 0,
    "vendorId" INTEGER NOT NULL DEFAULT 0,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "budget" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalHours" INTEGER DEFAULT 0,
    "rate" DECIMAL(65,30),
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
