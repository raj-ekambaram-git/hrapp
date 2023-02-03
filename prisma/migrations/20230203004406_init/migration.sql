/*
  Warnings:

  - Changed the type of `value` on the `AppConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AppConfig" DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "AppConfig_name_key_value_idx" ON "AppConfig"("name", "key", "value");
