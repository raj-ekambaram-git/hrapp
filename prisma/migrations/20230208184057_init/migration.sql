-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "workFlowEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "workFlowEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workFlowEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "workFlowEnabled" BOOLEAN NOT NULL DEFAULT false;
