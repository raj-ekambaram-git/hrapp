-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('General', 'Cost');

-- AlterEnum
ALTER TYPE "UserAttributeKeys" ADD VALUE 'enableTimesheetApprovalEmail';

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "receiveEmail" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "category" "ExpenseCategory" NOT NULL DEFAULT 'General';

-- CreateIndex
CREATE INDEX "Expense_projectId_status_idx" ON "Expense"("projectId", "status");

-- CreateIndex
CREATE INDEX "ExpenseTransaction_expenseId_id_status_createdDate_idx" ON "ExpenseTransaction"("expenseId", "id", "status", "createdDate");

-- CreateIndex
CREATE INDEX "ExpenseTransaction_expenseId_id_status_idx" ON "ExpenseTransaction"("expenseId", "id", "status");

-- CreateIndex
CREATE INDEX "Invoice_lastUpdateDate_idx" ON "Invoice"("lastUpdateDate");

-- CreateIndex
CREATE INDEX "Invoice_paidAmount_idx" ON "Invoice"("paidAmount");

-- CreateIndex
CREATE INDEX "Invoice_dueDte_idx" ON "Invoice"("dueDte");

-- CreateIndex
CREATE INDEX "Invoice_accountId_idx" ON "Invoice"("accountId");

-- CreateIndex
CREATE INDEX "Invoice_accountId_status_idx" ON "Invoice"("accountId", "status");

-- CreateIndex
CREATE INDEX "InvoiceTransaction_invoiceId_status_idx" ON "InvoiceTransaction"("invoiceId", "status");

-- CreateIndex
CREATE INDEX "InvoiceTransaction_lastUpdatedDate_status_idx" ON "InvoiceTransaction"("lastUpdatedDate", "status");

-- CreateIndex
CREATE INDEX "Project_accountId_status_idx" ON "Project"("accountId", "status");
