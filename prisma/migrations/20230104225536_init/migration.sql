/*
  Warnings:

  - You are about to drop the column `userAttributeKey` on the `UserAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `userAttributeValue` on the `UserAttributes` table. All the data in the column will be lost.
  - Added the required column `key` to the `UserAttributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UserAttributes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAttributes" DROP COLUMN "userAttributeKey",
DROP COLUMN "userAttributeValue",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "value" TEXT;
