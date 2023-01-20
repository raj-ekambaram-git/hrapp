-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "updatedById" INTEGER DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
