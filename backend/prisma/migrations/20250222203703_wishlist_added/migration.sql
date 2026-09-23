/*
  Warnings:

  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `productId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`productId`);

-- CreateTable
CREATE TABLE `Wishlist` (
    `wishlistId` INTEGER NOT NULL AUTO_INCREMENT,
    `roll_number` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Wishlist_roll_number_key`(`roll_number`),
    UNIQUE INDEX `Wishlist_productId_key`(`productId`),
    PRIMARY KEY (`wishlistId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
