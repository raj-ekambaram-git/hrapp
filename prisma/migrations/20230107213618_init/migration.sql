-- CreateEnum
CREATE TYPE "NotesMode" AS ENUM ('New', 'Reply');

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "mode" "NotesMode" NOT NULL DEFAULT 'New';
