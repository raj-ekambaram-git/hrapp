-- AlterTable
ALTER TABLE "PaymentMethods" ADD COLUMN     "accountId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "PaymentMethods" ADD CONSTRAINT "PaymentMethods_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
