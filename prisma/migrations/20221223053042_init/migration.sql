/*
  Warnings:

  - Changed the type of `entries` on the `TimesheetEntries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TimesheetEntries" DROP COLUMN "entries",
ADD COLUMN     "entries" JSONB NOT NULL;
