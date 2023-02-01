-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Trial', 'Full');

-- AlterEnum
ALTER TYPE "AccountStatus" ADD VALUE 'Approved';

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "type" "AccountType" NOT NULL DEFAULT 'Trial';

-- CreateIndex
CREATE INDEX "AppConfig_key_idx" ON "AppConfig"("key");

-- CreateIndex
CREATE INDEX "AppConfig_name_idx" ON "AppConfig"("name");

-- CreateIndex
CREATE INDEX "AppConfig_status_idx" ON "AppConfig"("status");

-- CreateIndex
CREATE INDEX "AppConfig_key_status_idx" ON "AppConfig"("key", "status");
