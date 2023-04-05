-- DropIndex
DROP INDEX `city_stateId_fkey` ON `city`;

-- DropIndex
DROP INDEX `distributor_cityId_fkey` ON `distributor`;

-- DropIndex
DROP INDEX `distributor_countryId_fkey` ON `distributor`;

-- DropIndex
DROP INDEX `distributor_stateId_fkey` ON `distributor`;

-- DropIndex
DROP INDEX `foodOrder_distributorId_fkey` ON `foodOrder`;

-- DropIndex
DROP INDEX `foodOrder_restaurantId_fkey` ON `foodOrder`;

-- DropIndex
DROP INDEX `foodOrderItem_foodOrderId_fkey` ON `foodOrderItem`;

-- DropIndex
DROP INDEX `foodOrderItem_productId_fkey` ON `foodOrderItem`;

-- DropIndex
DROP INDEX `media_distributorId_fkey` ON `media`;

-- DropIndex
DROP INDEX `media_productId_fkey` ON `media`;

-- DropIndex
DROP INDEX `media_restaurantId_fkey` ON `media`;

-- DropIndex
DROP INDEX `orderItem_orderPlacedId_fkey` ON `orderItem`;

-- DropIndex
DROP INDEX `orderItem_productId_fkey` ON `orderItem`;

-- DropIndex
DROP INDEX `restaurantDetails_cityId_fkey` ON `restaurantDetails`;

-- DropIndex
DROP INDEX `restaurantDetails_countryId_fkey` ON `restaurantDetails`;

-- DropIndex
DROP INDEX `restaurantDetails_ownerId_fkey` ON `restaurantDetails`;

-- DropIndex
DROP INDEX `restaurantDetails_stateId_fkey` ON `restaurantDetails`;

-- DropIndex
DROP INDEX `restaurantOrder_restaurantId_fkey` ON `restaurantOrder`;

-- DropIndex
DROP INDEX `state_countryId_fkey` ON `state`;

-- AlterTable
ALTER TABLE `user` MODIFY `image` VARCHAR(1000) NULL;
