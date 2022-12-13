-- CreateEnum
CREATE TYPE "UserAttributeKeys" AS ENUM ('default', 'rate', 'startDate', 'endDate');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ACCOUNT_ADMIN', 'ACCOUNT_VENDOR_REP', 'ACCOUNT_USER', 'ACCOUNT_VENDOR_EMPLOYEE', 'ACCOUNT_VENDOR_CONTRACTOR', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('Staffing', 'Product', 'Project');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('Approved', 'Rejected', 'Active', 'Inactive', 'Fraud');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Inactive', 'Fraud');

-- CreateEnum
CREATE TYPE "AddressStatus" AS ENUM ('A', 'I', 'D');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('Staffing', 'Product', 'Project');

-- CreateEnum
CREATE TYPE "InvoiceCycle" AS ENUM ('Weekly', 'BiWeekly', 'Monthly', 'Quarterly', 'HalfYearly', 'Yearly');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Draft', 'Submitted', 'Pending', 'PartiallyPaid', 'Paid', 'Cancelled');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('Net30', 'Net45', 'Net60', 'Net90');

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "address3" TEXT,
    "county" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "status" "AddressStatus" NOT NULL,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    "vendorId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ein" TEXT NOT NULL,
    "bankId" INTEGER,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '111-111-1111',
    "status" "AccountStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "type" "VendorType" NOT NULL DEFAULT 'Staffing',
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "ein" TEXT NOT NULL,
    "bankDetails" TEXT,
    "status" "VendorStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "accountContactName" TEXT,
    "accountContactEmail" TEXT,
    "accountContactPhone" TEXT,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "vendorId" INTEGER NOT NULL DEFAULT 0,
    "rate" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "type" "InvoiceType" NOT NULL,
    "cycle" "InvoiceCycle" NOT NULL,
    "resourceId" INTEGER NOT NULL DEFAULT 0,
    "vendorId" INTEGER NOT NULL DEFAULT 0,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER,
    "rate" DECIMAL(65,30),
    "dueDte" TIMESTAMP(3),
    "transactionId" TEXT,
    "notes" TEXT,
    "total" DECIMAL(65,30) NOT NULL,
    "paidAmount" DECIMAL(65,30),
    "status" "InvoiceStatus" NOT NULL,
    "paymentTerms" "PaymentTerms" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DEVELOPER',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '111-111-1111',
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "vendorId" INTEGER,
    "isTimeSheetEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "password" TEXT NOT NULL DEFAULT 'passw0rd',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAttributes" (
    "id" SERIAL NOT NULL,
    "userAttributeKey" "UserAttributeKeys" NOT NULL DEFAULT 'default',
    "userAttributeValue" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_ein_key" ON "Account"("ein");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_ein_key" ON "Vendor"("ein");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttributes" ADD CONSTRAINT "UserAttributes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
