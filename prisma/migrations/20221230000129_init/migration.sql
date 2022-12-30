-- CreateEnum
CREATE TYPE "ConfigStatus" AS ENUM ('Active', 'Inactive', 'MarkForDelete');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordExpired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordRetries" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "passwordSalt" TEXT NOT NULL DEFAULT '123456xyz';

-- CreateTable
CREATE TABLE "AppConfig" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "configKey" TEXT NOT NULL,
    "configValue" TEXT NOT NULL,
    "status" "ConfigStatus" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountConfig" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "configKey" TEXT NOT NULL,
    "configValue" TEXT NOT NULL,
    "status" "ConfigStatus" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountConfig" ADD CONSTRAINT "AccountConfig_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
