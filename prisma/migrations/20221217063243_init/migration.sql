-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('D', 'U', 'A', 'V');

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

-- CreateEnum
CREATE TYPE "InvoiceItemType" AS ENUM ('General', 'Projet', 'Staffing');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('Hours', 'Item');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Created', 'Open', 'Closed', 'Settled');

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'D',
    "address1" TEXT NOT NULL,
    "addressName" TEXT NOT NULL DEFAULT '',
    "address2" TEXT,
    "address3" TEXT,
    "county" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
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
    "phone" TEXT NOT NULL DEFAULT '111-111-1111',
    "type" "VendorType" NOT NULL DEFAULT 'Staffing',
    "accountId" INTEGER DEFAULT 0,
    "ein" TEXT NOT NULL,
    "bankDetails" TEXT,
    "status" "VendorStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountContactName" TEXT,
    "accountContactEmail" TEXT,
    "accountContactPhone" TEXT,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResource" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER DEFAULT 1,
    "userId" INTEGER DEFAULT 1,
    "unitPrice" DECIMAL(65,30),
    "currency" "Currency",
    "quantity" INTEGER,
    "uom" "UnitOfMeasure",
    "budgetAllocated" DECIMAL(65,30) DEFAULT 0,

    CONSTRAINT "ProjectResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "InvoiceType" NOT NULL,
    "vendorId" INTEGER DEFAULT 0,
    "accountId" INTEGER DEFAULT 0,
    "projectId" INTEGER DEFAULT 0,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDte" TIMESTAMP(3),
    "transactionId" TEXT,
    "notes" TEXT,
    "total" DECIMAL(65,30) NOT NULL,
    "paidAmount" DECIMAL(65,30),
    "status" "InvoiceStatus" NOT NULL,
    "paymentTerms" "PaymentTerms" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" SERIAL NOT NULL,
    "description" TEXT DEFAULT '',
    "type" "InvoiceItemType" NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "uom" "UnitOfMeasure" NOT NULL,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL,
    "generalNote" TEXT,
    "userId" INTEGER,
    "fromDate" TIMESTAMP(3),
    "toDate" TIMESTAMP(3),
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "InvoiceItemType" NOT NULL,
    "invoiceCycle" "InvoiceCycle" NOT NULL,
    "addressId" INTEGER NOT NULL DEFAULT 0,
    "vendorId" INTEGER NOT NULL DEFAULT 0,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "budget" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalHours" INTEGER DEFAULT 0,
    "averageRate" DECIMAL(65,30),
    "status" "ProjectStatus" NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DEVELOPER',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '111-111-1111',
    "accountId" INTEGER DEFAULT 0,
    "vendorId" INTEGER DEFAULT 0,
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
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttributes" ADD CONSTRAINT "UserAttributes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
