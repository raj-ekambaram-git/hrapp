-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "updatedById" INTEGER DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
