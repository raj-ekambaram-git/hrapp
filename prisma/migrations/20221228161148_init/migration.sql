/*
  Warnings:

  - Added the required column `createdBy` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NotesType" ADD VALUE 'TimesheetEntry';

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "createdBy" TEXT NOT NULL;
