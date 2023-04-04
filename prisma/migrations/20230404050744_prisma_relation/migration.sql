-- DropForeignKey
ALTER TABLE `_ProductToTag` DROP FOREIGN KEY `_ProductToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductToTag` DROP FOREIGN KEY `_ProductToTag_B_fkey`;

-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `city_stateId_fkey`;

-- DropForeignKey
ALTER TABLE `distributor` DROP FOREIGN KEY `distributor_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `distributor` DROP FOREIGN KEY `distributor_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `distributor` DROP FOREIGN KEY `distributor_stateId_fkey`;

-- DropForeignKey
ALTER TABLE `foodOrder` DROP FOREIGN KEY `foodOrder_distributorId_fkey`;

-- DropForeignKey
ALTER TABLE `foodOrder` DROP FOREIGN KEY `foodOrder_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `foodOrderItem` DROP FOREIGN KEY `foodOrderItem_foodOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `foodOrderItem` DROP FOREIGN KEY `foodOrderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `media_distributorId_fkey`;

-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `media_productId_fkey`;

-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `media_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `orderItem` DROP FOREIGN KEY `orderItem_orderPlacedId_fkey`;

-- DropForeignKey
ALTER TABLE `orderItem` DROP FOREIGN KEY `orderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `restaurantDetails` DROP FOREIGN KEY `restaurantDetails_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `restaurantDetails` DROP FOREIGN KEY `restaurantDetails_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `restaurantDetails` DROP FOREIGN KEY `restaurantDetails_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `restaurantDetails` DROP FOREIGN KEY `restaurantDetails_stateId_fkey`;

-- DropForeignKey
ALTER TABLE `restaurantOrder` DROP FOREIGN KEY `restaurantOrder_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `state` DROP FOREIGN KEY `state_countryId_fkey`;
