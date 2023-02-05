/*
  Warnings:

  - A unique constraint covering the columns `[accountId,featureId]` on the table `AccoutFeatures` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "AccoutFeatures_accountId_status_idx" ON "AccoutFeatures"("accountId", "status");

-- CreateIndex
CREATE INDEX "AccoutFeatures_featureId_status_idx" ON "AccoutFeatures"("featureId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccoutFeatures_accountId_featureId_key" ON "AccoutFeatures"("accountId", "featureId");
