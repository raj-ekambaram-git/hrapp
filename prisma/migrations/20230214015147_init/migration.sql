-- AlterEnum
ALTER TYPE "VendorType" ADD VALUE 'Supplier';

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "vendorId" INTEGER;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
