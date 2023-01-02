/*
  Warnings:

  - Added the required column `mmdd` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "mmdd" TEXT NOT NULL;
