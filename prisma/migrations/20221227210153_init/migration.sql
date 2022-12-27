/*
  Warnings:

  - You are about to drop the column `comments` on the `TimesheetEntries` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotesType" AS ENUM ('Timesheet', 'Account', 'Invoice', 'Project', 'User');

-- AlterTable
ALTER TABLE "Timesheet" ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TimesheetEntries" DROP COLUMN "comments";

-- CreateTable
CREATE TABLE "Notes" (
    "id" SERIAL NOT NULL,
    "type" "NotesType" NOT NULL,
    "typeId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);
