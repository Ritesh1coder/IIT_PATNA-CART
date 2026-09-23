/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roll_number]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roll_number` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `roll_number` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`roll_number`);

-- CreateIndex
CREATE UNIQUE INDEX `user_roll_number_key` ON `user`(`roll_number`);

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
