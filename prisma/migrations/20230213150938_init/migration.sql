/*
  Warnings:

  - You are about to drop the column `Status` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `status` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "Status",
ADD COLUMN     "status" "PaymentMethodStatus" NOT NULL,
ADD COLUMN     "updatedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
