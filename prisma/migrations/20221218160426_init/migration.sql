/*
  Warnings:

  - The values [Projet] on the enum `InvoiceItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceItemType_new" AS ENUM ('General', 'Project', 'Staffing');
ALTER TABLE "InvoiceItem" ALTER COLUMN "type" TYPE "InvoiceItemType_new" USING ("type"::text::"InvoiceItemType_new");
ALTER TABLE "Project" ALTER COLUMN "type" TYPE "InvoiceItemType_new" USING ("type"::text::"InvoiceItemType_new");
ALTER TYPE "InvoiceItemType" RENAME TO "InvoiceItemType_old";
ALTER TYPE "InvoiceItemType_new" RENAME TO "InvoiceItemType";
DROP TYPE "InvoiceItemType_old";
COMMIT;
