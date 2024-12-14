/*
  Warnings:

  - You are about to drop the column `photo` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "photo",
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "profilePhoto",
ADD COLUMN     "image" TEXT;
