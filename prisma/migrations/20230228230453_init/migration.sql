-- CreateIndex
CREATE INDEX "ExportTemplate_name_idx" ON "ExportTemplate"("name");

-- CreateIndex
CREATE INDEX "ExportTemplate_accountId_idx" ON "ExportTemplate"("accountId");

-- CreateIndex
CREATE INDEX "ExportTemplate_type_idx" ON "ExportTemplate"("type");

-- CreateIndex
CREATE INDEX "ExportTemplate_accountId_type_idx" ON "ExportTemplate"("accountId", "type");

-- CreateIndex
CREATE INDEX "ExportTemplate_accountId_type_schedule_idx" ON "ExportTemplate"("accountId", "type", "schedule");
