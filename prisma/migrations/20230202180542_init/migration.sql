-- CreateEnum
CREATE TYPE "ExportTemplateStatus" AS ENUM ('Active', 'Inactive', 'MarkForDelete');

-- CreateEnum
CREATE TYPE "ExportType" AS ENUM ('System', 'User');

-- CreateEnum
CREATE TYPE "ExportFileType" AS ENUM ('PDF', 'CSV');

-- CreateTable
CREATE TABLE "ExportTemplate" (
    "id" SERIAL NOT NULL,
    "type" "ExportType" NOT NULL,
    "name" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "templateName" TEXT NOT NULL,
    "queries" JSONB NOT NULL,
    "fileType" "ExportFileType" NOT NULL,
    "status" "ExportTemplateStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExportTemplate" ADD CONSTRAINT "ExportTemplate_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
