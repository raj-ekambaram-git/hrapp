-- CreateIndex
CREATE INDEX "Address_accountId_idx" ON "Address"("accountId");

-- CreateIndex
CREATE INDEX "Address_accountId_vendorId_userId_idx" ON "Address"("accountId", "vendorId", "userId");

-- CreateIndex
CREATE INDEX "Address_vendorId_userId_idx" ON "Address"("vendorId", "userId");
