-- AlterEnum
ALTER TYPE "InvoiceType" ADD VALUE 'Timesheet';

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "timesheetEntryId" INTEGER;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_timesheetEntryId_fkey" FOREIGN KEY ("timesheetEntryId") REFERENCES "TimesheetEntries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
