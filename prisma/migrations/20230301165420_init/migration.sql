-- CreateEnum
CREATE TYPE "VendorSettingStatus" AS ENUM ('Active', 'Inactive', 'MarkForDelete');

-- CreateTable
CREATE TABLE "VendorSetting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "status" "VendorSettingStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorSetting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VendorSetting" ADD CONSTRAINT "VendorSetting_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
