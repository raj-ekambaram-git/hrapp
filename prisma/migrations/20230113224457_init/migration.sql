-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Account', 'Invoice', 'Vendor', 'Project', 'User', 'TimesheetEntry', 'TimesheetApproval', 'Expense', 'ExpenseEntry');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('Active', 'Inactive', 'Delete');

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "typeId" INTEGER NOT NULL,
    "urlPath" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_createdBy_idx" ON "Document"("createdBy");

-- CreateIndex
CREATE INDEX "Document_createdBy_status_idx" ON "Document"("createdBy", "status");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_type_status_idx" ON "Document"("type", "status");

-- CreateIndex
CREATE INDEX "Document_type_typeId_idx" ON "Document"("type", "typeId");

-- CreateIndex
CREATE INDEX "Document_type_typeId_status_idx" ON "Document"("type", "typeId", "status");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
