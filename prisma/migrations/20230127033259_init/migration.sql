/*
  Warnings:

  - You are about to drop the column `type` on the `Contact` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactAssociationStatus" AS ENUM ('Active', 'Inactive', 'MarkForDelete');

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "type",
ADD COLUMN     "accountId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ContactAssociation" (
    "id" SERIAL NOT NULL,
    "type" "ContactType" NOT NULL,
    "typeId" INTEGER NOT NULL,
    "status" "ContactAssociationStatus" NOT NULL,

    CONSTRAINT "ContactAssociation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
