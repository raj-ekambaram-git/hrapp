-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ACCOUNT_MANAGER';

-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "isMonthBeginDate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMonthEndDate" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "vendorObservedHoliday" SET DEFAULT false;
