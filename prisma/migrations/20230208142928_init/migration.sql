-- CreateEnum
CREATE TYPE "WorkFlowTaskType" AS ENUM ('Vendor', 'User', 'Project', 'Invoice');

-- CreateEnum
CREATE TYPE "WorkFlowTaskStatus" AS ENUM ('Draft', 'Active', 'Inactive');

-- CreateEnum
CREATE TYPE "WorkFlowType" AS ENUM ('Vendor', 'User', 'Project', 'Invoice');

-- CreateEnum
CREATE TYPE "WorkFlowStatus" AS ENUM ('Draft', 'Active', 'Inactive');

-- CreateEnum
CREATE TYPE "WorkFlowStepStatus" AS ENUM ('Pending', 'InProgress', 'Complete', 'Delayed', 'Skipped');

-- CreateTable
CREATE TABLE "WorkFlowTask" (
    "id" SERIAL NOT NULL,
    "type" "WorkFlowTaskType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "status" "WorkFlowTaskStatus" NOT NULL DEFAULT 'Draft',
    "configData" JSONB,
    "updatedBy" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkFlowTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkFlow" (
    "id" SERIAL NOT NULL,
    "type" "WorkFlowType" NOT NULL,
    "typeId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "status" "WorkFlowStatus" NOT NULL,
    "updatedBy" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkFlowStep" (
    "id" SERIAL NOT NULL,
    "workFlowId" INTEGER NOT NULL DEFAULT 0,
    "stepNumber" INTEGER NOT NULL DEFAULT 0,
    "taskId" INTEGER NOT NULL DEFAULT 0,
    "assignedTo" INTEGER,
    "dueDate" TIMESTAMP(3),
    "configData" JSONB,
    "status" "WorkFlowStepStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkFlowStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkFlowTask_accountId_status_idx" ON "WorkFlowTask"("accountId", "status");

-- CreateIndex
CREATE INDEX "WorkFlowTask_accountId_idx" ON "WorkFlowTask"("accountId");

-- CreateIndex
CREATE INDEX "WorkFlowTask_type_status_idx" ON "WorkFlowTask"("type", "status");

-- CreateIndex
CREATE INDEX "WorkFlowTask_type_idx" ON "WorkFlowTask"("type");

-- CreateIndex
CREATE UNIQUE INDEX "WorkFlowTask_type_name_accountId_key" ON "WorkFlowTask"("type", "name", "accountId");

-- CreateIndex
CREATE INDEX "WorkFlow_accountId_status_idx" ON "WorkFlow"("accountId", "status");

-- CreateIndex
CREATE INDEX "WorkFlow_type_idx" ON "WorkFlow"("type");

-- CreateIndex
CREATE INDEX "WorkFlow_type_typeId_status_idx" ON "WorkFlow"("type", "typeId", "status");

-- CreateIndex
CREATE INDEX "WorkFlow_type_typeId_accountId_status_idx" ON "WorkFlow"("type", "typeId", "accountId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkFlow_type_typeId_accountId_key" ON "WorkFlow"("type", "typeId", "accountId");

-- CreateIndex
CREATE INDEX "WorkFlowStep_workFlowId_idx" ON "WorkFlowStep"("workFlowId");

-- CreateIndex
CREATE INDEX "WorkFlowStep_assignedTo_idx" ON "WorkFlowStep"("assignedTo");

-- CreateIndex
CREATE INDEX "WorkFlowStep_assignedTo_status_idx" ON "WorkFlowStep"("assignedTo", "status");

-- CreateIndex
CREATE INDEX "WorkFlowStep_assignedTo_status_dueDate_idx" ON "WorkFlowStep"("assignedTo", "status", "dueDate");

-- AddForeignKey
ALTER TABLE "WorkFlowTask" ADD CONSTRAINT "WorkFlowTask_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlowTask" ADD CONSTRAINT "WorkFlowTask_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlow" ADD CONSTRAINT "WorkFlow_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlow" ADD CONSTRAINT "WorkFlow_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlowStep" ADD CONSTRAINT "WorkFlowStep_workFlowId_fkey" FOREIGN KEY ("workFlowId") REFERENCES "WorkFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlowStep" ADD CONSTRAINT "WorkFlowStep_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "WorkFlowTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlowStep" ADD CONSTRAINT "WorkFlowStep_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
