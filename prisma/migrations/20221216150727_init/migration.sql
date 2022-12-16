/*
  Warnings:

  - You are about to drop the column `rate` on the `Project` table. All the data in the column will be lost.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Created', 'Open', 'Closed', 'Settled');

-- AlterEnum
ALTER TYPE "InvoiceItemType" ADD VALUE 'Staffing';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "rate",
ADD COLUMN     "averageRate" DECIMAL(65,30),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL;
