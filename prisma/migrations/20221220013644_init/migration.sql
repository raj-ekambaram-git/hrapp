-- CreateEnum
CREATE TYPE "TimesheetStatus" AS ENUM ('Draft', 'Saved', 'Approved', 'Rejected', 'Invoiced');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "timeSheetNotesRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "calendarDate" TIMESTAMP(3) NOT NULL,
    "businessDay" BOOLEAN NOT NULL,
    "weekDay" BOOLEAN NOT NULL,
    "vendorObservedHoliday" BOOLEAN NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimesheetActivity" (
    "id" SERIAL NOT NULL,
    "timesheetId" INTEGER,
    "projectId" INTEGER DEFAULT 1,
    "status" "TimesheetStatus" NOT NULL,
    "approvedDate" TIMESTAMP(3) NOT NULL,
    "activityData" TEXT NOT NULL,

    CONSTRAINT "TimesheetActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimesheetActivity" ADD CONSTRAINT "TimesheetActivity_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetActivity" ADD CONSTRAINT "TimesheetActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
