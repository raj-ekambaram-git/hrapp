-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('D', 'U', 'A', 'V');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "type" "AddressType" NOT NULL DEFAULT 'D';
