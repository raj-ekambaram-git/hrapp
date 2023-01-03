-- AlterTable
ALTER TABLE "TimesheetEntries" ADD COLUMN     "approvedBy" INTEGER DEFAULT 1;

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
