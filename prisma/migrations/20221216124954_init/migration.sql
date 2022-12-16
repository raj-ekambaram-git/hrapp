-- CreateEnum
CREATE TYPE "InvoiceItemType" AS ENUM ('General', 'Projet');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "primary" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" SERIAL NOT NULL,
    "description" TEXT DEFAULT '',
    "type" "InvoiceItemType" NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL,
    "generalNote" TEXT,
    "userId" INTEGER,
    "fromDate" TIMESTAMP(3),
    "toDate" TIMESTAMP(3),
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
