-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('Account', 'Vendor');

-- CreateEnum
CREATE TYPE "PaymentMethodStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "id" SERIAL NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "token" TEXT NOT NULL,
    "Status" "PaymentMethodStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id")
);
