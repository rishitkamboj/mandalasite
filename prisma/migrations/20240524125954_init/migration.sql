/*
  Warnings:

  - Added the required column `availablequantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availablequantity" INTEGER NOT NULL;
