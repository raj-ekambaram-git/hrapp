/*
  Warnings:

  - Made the column `projectId` on table `TimesheetEntries` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TimesheetEntries" DROP CONSTRAINT "TimesheetEntries_projectId_fkey";

-- AlterTable
ALTER TABLE "TimesheetEntries" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
