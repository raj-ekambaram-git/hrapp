-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Employee', 'Contractor', 'LeadContact');

-- CreateEnum
CREATE TYPE "VendorUserStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'Employee';

-- CreateTable
CREATE TABLE "VendorUsers" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER DEFAULT 0,
    "userId" INTEGER DEFAULT 0,
    "status" "VendorUserStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER DEFAULT 0,
    "role" "Role" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorUsers_vendorId_userId_key" ON "VendorUsers"("vendorId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_userId_role_key" ON "UserRoles"("userId", "role");

-- AddForeignKey
ALTER TABLE "VendorUsers" ADD CONSTRAINT "VendorUsers_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorUsers" ADD CONSTRAINT "VendorUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
