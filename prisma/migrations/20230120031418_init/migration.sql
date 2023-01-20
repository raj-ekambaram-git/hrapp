/*
  Warnings:

  - You are about to drop the column `timeSheetNotesRequired` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "timeSheetNotesRequired",
ADD COLUMN     "timesheetNotesRequired" BOOLEAN NOT NULL DEFAULT false;
