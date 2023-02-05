-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('Upload', 'Signature');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "category" "DocumentCategory" NOT NULL DEFAULT 'Upload',
ADD COLUMN     "emailTo" TEXT[];
