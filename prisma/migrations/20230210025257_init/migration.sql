-- AlterTable
ALTER TABLE "ExportTemplate" ADD COLUMN     "emailTemplate" TEXT,
ADD COLUMN     "schedule" BOOLEAN NOT NULL DEFAULT false;
