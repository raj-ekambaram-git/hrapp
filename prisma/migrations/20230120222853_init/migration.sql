/*
  Warnings:

  - You are about to drop the column `createdBy` on the `AccountConfig` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `AccountConfig` table. All the data in the column will be lost.
  - You are about to drop the column `configKey` on the `AppConfig` table. All the data in the column will be lost.
  - You are about to drop the column `configValue` on the `AppConfig` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `AppConfig` table. All the data in the column will be lost.
  - Added the required column `key` to the `AppConfig` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConfigType" AS ENUM ('App', 'Account', 'User');

-- CreateEnum
CREATE TYPE "ConfigInputType" AS ENUM ('TextBox', 'Toggle', 'DropDown', 'Checkbox', 'CheckboxMultiSelect');

-- AlterTable
ALTER TABLE "AccountConfig" DROP COLUMN "createdBy",
DROP COLUMN "createdDate",
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "AppConfig" DROP COLUMN "configKey",
DROP COLUMN "configValue",
DROP COLUMN "createdBy",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "updatedBy" INTEGER,
ADD COLUMN     "value" TEXT[];

-- CreateTable
CREATE TABLE "AppConfigLookup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "configDescription" TEXT NOT NULL,
    "type" "ConfigType" NOT NULL,
    "value" JSONB NOT NULL,
    "status" "ConfigStatus" NOT NULL,
    "configInputType" "ConfigInputType" NOT NULL,
    "updatedBy" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppConfigLookup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppConfigLookup" ADD CONSTRAINT "AppConfigLookup_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppConfig" ADD CONSTRAINT "AppConfig_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountConfig" ADD CONSTRAINT "AccountConfig_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
