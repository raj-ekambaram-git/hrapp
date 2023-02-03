/*
  Warnings:

  - The `value` column on the `AppConfig` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `value` on the `AppConfigLookup` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "AppConfig_name_key_value_idx";

-- AlterTable
ALTER TABLE "AppConfig" DROP COLUMN "value",
ADD COLUMN     "value" TEXT[];

-- AlterTable
ALTER TABLE "AppConfigLookup" DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL;
