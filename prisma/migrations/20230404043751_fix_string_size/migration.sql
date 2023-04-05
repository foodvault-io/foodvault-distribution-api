/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `distributor` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `foodOrder` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `foodOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `orderItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `restaurantDetails` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `restaurantOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `account` MODIFY `refreshToken` VARCHAR(1000) NULL,
    MODIFY `accessToken` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `distributor` DROP COLUMN `deletedAt`,
    MODIFY `description` VARCHAR(500) NULL,
    MODIFY `website` VARCHAR(250) NULL,
    MODIFY `address` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `foodOrder` DROP COLUMN `deletedAt`,
    MODIFY `orderDescription` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `foodOrderItem` DROP COLUMN `deletedAt`,
    MODIFY `description` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `media` DROP COLUMN `deletedAt`,
    MODIFY `fileUrl` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `orderItem` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `deletedAt`,
    MODIFY `description` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `restaurantDetails` DROP COLUMN `deletedAt`,
    MODIFY `description` MEDIUMTEXT NULL,
    MODIFY `image` VARCHAR(500) NULL,
    MODIFY `address` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `restaurantOrder` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `user` MODIFY `hashedPassword` VARCHAR(1000) NULL;
