/*
  Warnings:

  - Added the required column `displayName` to the `VendorSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VendorSetting" ADD COLUMN     "displayName" TEXT NOT NULL;
