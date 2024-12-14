/*
  Warnings:

  - Added the required column `discountStatus` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "discountStatus" "DiscountStatus" NOT NULL;
