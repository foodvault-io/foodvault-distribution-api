/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Distributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('super', 'admin', 'restaurant', 'user');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "restaurant_status" AS ENUM ('active', 'inactive', 'suspended');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_countryId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_stateId_fkey";

-- DropForeignKey
ALTER TABLE "Distributor" DROP CONSTRAINT "Distributor_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Distributor" DROP CONSTRAINT "Distributor_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Distributor" DROP CONSTRAINT "Distributor_stateId_fkey";

-- DropForeignKey
ALTER TABLE "FoodOrder" DROP CONSTRAINT "FoodOrder_distributorId_fkey";

-- DropForeignKey
ALTER TABLE "FoodOrder" DROP CONSTRAINT "FoodOrder_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "FoodOrderItem" DROP CONSTRAINT "FoodOrderItem_foodOrderId_fkey";

-- DropForeignKey
ALTER TABLE "FoodOrderItem" DROP CONSTRAINT "FoodOrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_distributorId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_productId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderPlacedId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantDetails" DROP CONSTRAINT "RestaurantDetails_cityId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantDetails" DROP CONSTRAINT "RestaurantDetails_countryId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantDetails" DROP CONSTRAINT "RestaurantDetails_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantDetails" DROP CONSTRAINT "RestaurantDetails_stateId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantOrder" DROP CONSTRAINT "RestaurantOrder_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_countryId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "Distributor";

-- DropTable
DROP TABLE "FoodOrder";

-- DropTable
DROP TABLE "FoodOrderItem";

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "RestaurantDetails";

-- DropTable
DROP TABLE "RestaurantOrder";

-- DropTable
DROP TABLE "State";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "RestaurantStatus";

-- DropEnum
DROP TYPE "RoleEnum";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "image" TEXT,
    "role" "role_enum"[] DEFAULT ARRAY['user']::"role_enum"[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL DEFAULT 'local',
    "provider" TEXT NOT NULL DEFAULT 'local',
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" INTEGER,
    "tokenType" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_details" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" "restaurant_status" NOT NULL DEFAULT 'active',
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

    CONSTRAINT "restaurant_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "restaurant_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "orderPlacedId" TEXT,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 3.5,
    "tags" TEXT[],

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_order" (
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

    CONSTRAINT "food_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_order_item" (
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

    CONSTRAINT "food_order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "lat" TEXT,
    "lon" TEXT,

    CONSTRAINT "distributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "fileName" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "restaurantId" TEXT,
    "distributorId" TEXT,
    "productId" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_userId_key" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_details" ADD CONSTRAINT "restaurant_details_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_details" ADD CONSTRAINT "restaurant_details_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_details" ADD CONSTRAINT "restaurant_details_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_details" ADD CONSTRAINT "restaurant_details_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_order" ADD CONSTRAINT "restaurant_order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderPlacedId_fkey" FOREIGN KEY ("orderPlacedId") REFERENCES "restaurant_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_order" ADD CONSTRAINT "food_order_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_order" ADD CONSTRAINT "food_order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_order_item" ADD CONSTRAINT "food_order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_order_item" ADD CONSTRAINT "food_order_item_foodOrderId_fkey" FOREIGN KEY ("foodOrderId") REFERENCES "food_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributor" ADD CONSTRAINT "distributor_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributor" ADD CONSTRAINT "distributor_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributor" ADD CONSTRAINT "distributor_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
