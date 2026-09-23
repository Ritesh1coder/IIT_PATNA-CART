-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `images` JSON NOT NULL,
    `price` DOUBLE NOT NULL,
    `seller` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `upiId` VARCHAR(191) NOT NULL,
    `qrImage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
