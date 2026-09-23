/*
  Warnings:

  - A unique constraint covering the columns `[roll_number,productId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Wishlist_productId_key` ON `wishlist`;

-- DropIndex
DROP INDEX `Wishlist_roll_number_key` ON `wishlist`;

-- CreateIndex
CREATE UNIQUE INDEX `Wishlist_roll_number_productId_key` ON `Wishlist`(`roll_number`, `productId`);

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;
