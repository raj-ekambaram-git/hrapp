-- DropIndex
DROP INDEX "TimesheetEntries_timesheetId_projectId_billable_status_key";

-- CreateIndex
CREATE INDEX "TimesheetEntries_timesheetId_projectId_billable_status_idx" ON "TimesheetEntries"("timesheetId", "projectId", "billable", "status");

-- CreateIndex
CREATE INDEX "TimesheetEntries_timesheetId_projectId_billable_idx" ON "TimesheetEntries"("timesheetId", "projectId", "billable");

-- CreateIndex
CREATE INDEX "TimesheetEntries_timesheetId_projectId_idx" ON "TimesheetEntries"("timesheetId", "projectId");

-- CreateIndex
CREATE INDEX "TimesheetEntries_timesheetId_idx" ON "TimesheetEntries"("timesheetId");
