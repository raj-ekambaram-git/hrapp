-- AlterTable
ALTER TABLE "ExpenseEntry" ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ExpenseTransaction" ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "paidAmount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "InvoiceTransaction" ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "averageRate" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ProjectResource" ALTER COLUMN "unitPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "TimesheetEntries" ALTER COLUMN "unitPrice" SET DEFAULT 0;
