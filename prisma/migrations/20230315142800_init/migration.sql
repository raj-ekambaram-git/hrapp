/*
  Warnings:

  - A unique constraint covering the columns `[timesheetId,projectId,billable,status]` on the table `TimesheetEntries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TimesheetEntries_timesheetId_projectId_billable_key";

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetEntries_timesheetId_projectId_billable_status_key" ON "TimesheetEntries"("timesheetId", "projectId", "billable", "status");
