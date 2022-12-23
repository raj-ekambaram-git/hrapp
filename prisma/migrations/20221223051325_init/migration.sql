/*
  Warnings:

  - You are about to drop the `TimesheetActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimesheetActivity" DROP CONSTRAINT "TimesheetActivity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TimesheetActivity" DROP CONSTRAINT "TimesheetActivity_timesheetId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceEmailTo" TEXT;

-- DropTable
DROP TABLE "TimesheetActivity";

-- CreateTable
CREATE TABLE "TimesheetEntries" (
    "id" SERIAL NOT NULL,
    "timesheetId" INTEGER,
    "projectId" INTEGER DEFAULT 1,
    "status" "TimesheetStatus" NOT NULL,
    "approvedDate" TIMESTAMP(3),
    "entries" TEXT NOT NULL,

    CONSTRAINT "TimesheetEntries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
