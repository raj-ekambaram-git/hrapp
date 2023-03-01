/*
  Warnings:

  - A unique constraint covering the columns `[vendorId,key]` on the table `VendorSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "VendorSetting_vendorId_idx" ON "VendorSetting"("vendorId");

-- CreateIndex
CREATE INDEX "VendorSetting_vendorId_key_idx" ON "VendorSetting"("vendorId", "key");

-- CreateIndex
CREATE INDEX "VendorSetting_vendorId_status_idx" ON "VendorSetting"("vendorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "VendorSetting_vendorId_key_key" ON "VendorSetting"("vendorId", "key");
