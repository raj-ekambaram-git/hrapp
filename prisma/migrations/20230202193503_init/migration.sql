/*
  Warnings:

  - Changed the type of `type` on the `ExportTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExportTemplateType" AS ENUM ('System', 'User');

-- AlterTable
ALTER TABLE "ExportTemplate" DROP COLUMN "type",
ADD COLUMN     "type" "ExportTemplateType" NOT NULL;

-- DropEnum
DROP TYPE "ExportType";
