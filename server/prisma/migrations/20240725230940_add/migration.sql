/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Mark` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- AlterTable
ALTER TABLE "Mark" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "teacherId";
