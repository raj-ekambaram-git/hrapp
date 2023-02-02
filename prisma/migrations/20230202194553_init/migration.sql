-- DropForeignKey
ALTER TABLE "ExportTemplate" DROP CONSTRAINT "ExportTemplate_accountId_fkey";

-- AlterTable
ALTER TABLE "ExportTemplate" ALTER COLUMN "accountId" DROP NOT NULL,
ALTER COLUMN "templateName" DROP NOT NULL,
ALTER COLUMN "fileType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExportTemplate" ADD CONSTRAINT "ExportTemplate_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
