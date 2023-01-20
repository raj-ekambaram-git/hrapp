/*
  Warnings:

  - The values [Cost] on the enum `ExpenseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExpenseType_new" AS ENUM ('Airfare_C', 'Airfare_E', 'Baggage', 'Breakfast', 'CarRental', 'Cellular', 'Dinner', 'Dues', 'Education', 'Exam', 'Entertaintment_M', 'Entertaintment_O', 'Gas', 'Hotel', 'Hotel_Tax', 'Internet', 'Laundry', 'Lunch', 'Meals', 'Mileage', 'Others', 'Parking_Tolls', 'Passport_Visa_Fee', 'Postage', 'Resource_Cost', 'Shipping', 'Subscription', 'Supplies', 'Taxi', 'Tips');
ALTER TABLE "ExpenseEntry" ALTER COLUMN "type" TYPE "ExpenseType_new" USING ("type"::text::"ExpenseType_new");
ALTER TYPE "ExpenseType" RENAME TO "ExpenseType_old";
ALTER TYPE "ExpenseType_new" RENAME TO "ExpenseType";
DROP TYPE "ExpenseType_old";
COMMIT;
