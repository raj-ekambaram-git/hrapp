/*
  Warnings:

  - The primary key for the `Calendar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessDay` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `calendarDate` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `isMonthBeginDate` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `isMonthEndDate` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `vendorObservedHoliday` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `weekDay` on the `Calendar` table. All the data in the column will be lost.
  - Added the required column `dateActual` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateDimId` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayName` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfMonth` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfQuarter` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfYear` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daySuffix` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `epoch` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstDayOfMonth` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstDayOfQuarter` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstDayOfWeek` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstDayOfYear` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastDayOfMonth` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastDayOfQuarter` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastDayOfWeek` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastDayOfYear` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mmddyyyy` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mmyyyy` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthActual` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthName` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthNameAbbreviated` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarterActual` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarterName` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekOfMonth` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekOfYear` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekOfYearISO` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekend` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearActual` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_pkey",
DROP COLUMN "businessDay",
DROP COLUMN "calendarDate",
DROP COLUMN "id",
DROP COLUMN "isMonthBeginDate",
DROP COLUMN "isMonthEndDate",
DROP COLUMN "vendorObservedHoliday",
DROP COLUMN "weekDay",
ADD COLUMN     "dateActual" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateDimId" INTEGER NOT NULL,
ADD COLUMN     "dayName" TEXT NOT NULL,
ADD COLUMN     "dayOfMonth" INTEGER NOT NULL,
ADD COLUMN     "dayOfQuarter" INTEGER NOT NULL,
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "dayOfYear" INTEGER NOT NULL,
ADD COLUMN     "daySuffix" TEXT NOT NULL,
ADD COLUMN     "epoch" BIGINT NOT NULL,
ADD COLUMN     "firstDayOfMonth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstDayOfQuarter" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstDayOfWeek" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstDayOfYear" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastDayOfMonth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastDayOfQuarter" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastDayOfWeek" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastDayOfYear" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mmddyyyy" TEXT NOT NULL,
ADD COLUMN     "mmyyyy" TEXT NOT NULL,
ADD COLUMN     "monthActual" INTEGER NOT NULL,
ADD COLUMN     "monthName" TEXT NOT NULL,
ADD COLUMN     "monthNameAbbreviated" TEXT NOT NULL,
ADD COLUMN     "quarterActual" INTEGER NOT NULL,
ADD COLUMN     "quarterName" INTEGER NOT NULL,
ADD COLUMN     "weekOfMonth" INTEGER NOT NULL,
ADD COLUMN     "weekOfYear" INTEGER NOT NULL,
ADD COLUMN     "weekOfYearISO" TEXT NOT NULL,
ADD COLUMN     "weekend" BOOLEAN NOT NULL,
ADD COLUMN     "yearActual" INTEGER NOT NULL,
ADD CONSTRAINT "Calendar_pkey" PRIMARY KEY ("dateDimId");
