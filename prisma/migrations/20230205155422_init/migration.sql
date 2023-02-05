-- CreateEnum
CREATE TYPE "AccountFeatureStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "FeatureStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "FeatureStatus" NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccoutFeatures" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "featureId" INTEGER NOT NULL DEFAULT 0,
    "status" "AccountFeatureStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccoutFeatures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccoutFeatures" ADD CONSTRAINT "AccoutFeatures_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccoutFeatures" ADD CONSTRAINT "AccoutFeatures_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
