/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `coupons` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecentProductView" DROP CONSTRAINT "RecentProductView_customerId_fkey";

-- DropForeignKey
ALTER TABLE "RecentProductView" DROP CONSTRAINT "RecentProductView_productId_fkey";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "profilePhoto",
ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "discountType";

-- DropEnum
DROP TYPE "DiscountType";
