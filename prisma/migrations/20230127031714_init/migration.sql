-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('Active', 'Inactive', 'MarkForDelete');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('Vendor', 'Project');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "contactId" INTEGER;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "paymentTerms" "PaymentTerms" NOT NULL DEFAULT 'Net30';

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "type" "ContactType" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRelation" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER DEFAULT 1,
    "childId" INTEGER DEFAULT 1,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRelation" ADD CONSTRAINT "ProjectRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRelation" ADD CONSTRAINT "ProjectRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
