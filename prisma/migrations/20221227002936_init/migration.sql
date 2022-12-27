-- AlterTable
ALTER TABLE "ProjectResource" ADD COLUMN     "isTimesheetApprover" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TimesheetEntries" ADD COLUMN     "comments" TEXT;
