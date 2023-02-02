/*
  Warnings:

  - You are about to drop the column `queries` on the `ExportTemplate` table. All the data in the column will be lost.
  - Added the required column `queryMeta` to the `ExportTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExportTemplate" DROP COLUMN "queries",
ADD COLUMN     "queryMeta" JSONB NOT NULL;
