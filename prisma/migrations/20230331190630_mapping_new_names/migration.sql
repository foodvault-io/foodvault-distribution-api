/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `food_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `food_order_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `restaurant_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `restaurant_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "roleEnum" AS ENUM ('super', 'admin', 'restaurant', 'user');

-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "restaurantStatus" AS ENUM ('active', 'inactive', 'suspended');

-- DropForeignKey
ALTER TABLE "food_order" DROP CONSTRAINT "food_order_distributorId_fkey";

-- DropForeignKey
ALTER TABLE "food_order" DROP CONSTRAINT "food_order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "food_order_item" DROP CONSTRAINT "food_order_item_foodOrderId_fkey";

-- DropForeignKey
ALTER TABLE "food_order_item" DROP CONSTRAINT "food_order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderPlacedId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "restaurant_details" DROP CONSTRAINT "restaurant_details_cityId_fkey";

-- DropForeignKey
ALTER TABLE "restaurant_details" DROP CONSTRAINT "restaurant_details_countryId_fkey";

-- DropForeignKey
ALTER TABLE "restaurant_details" DROP CONSTRAINT "restaurant_details_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "restaurant_details" DROP CONSTRAINT "restaurant_details_stateId_fkey";

-- DropForeignKey
ALTER TABLE "restaurant_order" DROP CONSTRAINT "restaurant_order_restaurantId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "roleEnum"[] DEFAULT ARRAY['user']::"roleEnum"[];

-- DropTable
DROP TABLE "food_order";

-- DropTable
DROP TABLE "food_order_item";

-- DropTable
DROP TABLE "order_item";

-- DropTable
DROP TABLE "restaurant_details";

-- DropTable
DROP TABLE "restaurant_order";

-- DropEnum
DROP TYPE "restaurant_status";

-- DropEnum
DROP TYPE "role_enum";

-- DropEnum
DROP TYPE "user_status";

-- CreateTable
CREATE TABLE "restaurantDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" "restaurantStatus" NOT NULL DEFAULT 'active',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "image" TEXT,
    "address" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "lat" TEXT,
    "lon" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "restaurantDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurantOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "restaurantOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "orderPlacedId" TEXT,

    CONSTRAINT "orderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "orderName" TEXT NOT NULL,
    "dateOfOrder" TIMESTAMP(3),
    "orderDescription" TEXT,
    "distributor" TEXT NOT NULL,
    "distributorId" TEXT,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "foodOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodOrderItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "productName" TEXT NOT NULL,
    "productId" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "foodOrderId" TEXT NOT NULL,

    CONSTRAINT "foodOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restaurantDetails" ADD CONSTRAINT "restaurantDetails_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurantDetails" ADD CONSTRAINT "restaurantDetails_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurantDetails" ADD CONSTRAINT "restaurantDetails_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurantDetails" ADD CONSTRAINT "restaurantDetails_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurantOrder" ADD CONSTRAINT "restaurantOrder_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurantDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_orderPlacedId_fkey" FOREIGN KEY ("orderPlacedId") REFERENCES "restaurantOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodOrder" ADD CONSTRAINT "foodOrder_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodOrder" ADD CONSTRAINT "foodOrder_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurantDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodOrderItem" ADD CONSTRAINT "foodOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodOrderItem" ADD CONSTRAINT "foodOrderItem_foodOrderId_fkey" FOREIGN KEY ("foodOrderId") REFERENCES "foodOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurantDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
