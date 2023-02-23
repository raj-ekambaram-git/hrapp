/*
  Warnings:

  - A unique constraint covering the columns `[timesheetId,projectId,billable]` on the table `TimesheetEntries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimesheetEntries_timesheetId_projectId_billable_key" ON "TimesheetEntries"("timesheetId", "projectId", "billable");
