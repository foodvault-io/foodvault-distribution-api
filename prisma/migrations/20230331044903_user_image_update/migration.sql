/*
  Warnings:

  - You are about to drop the column `ownerUserId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_ownerUserId_fkey";

-- DropIndex
DROP INDEX "Media_ownerUserId_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "ownerUserId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;
