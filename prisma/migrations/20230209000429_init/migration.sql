-- AlterTable
ALTER TABLE "WorkFlow" ADD COLUMN     "completedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WorkFlowStep" ADD COLUMN     "completedDate" TIMESTAMP(3);
