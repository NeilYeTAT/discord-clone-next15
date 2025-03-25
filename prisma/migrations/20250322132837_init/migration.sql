/*
  Warnings:

  - You are about to drop the column `createdAtAt` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `DirectMessage` DROP FOREIGN KEY `DirectMessage_fileTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_fileTypeId_fkey`;

-- DropIndex
DROP INDEX `DirectMessage_fileTypeId_fkey` ON `DirectMessage`;

-- DropIndex
DROP INDEX `Message_fileTypeId_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `createdAtAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_fileTypeId_fkey` FOREIGN KEY (`fileTypeId`) REFERENCES `FileTypeMap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessage` ADD CONSTRAINT `DirectMessage_fileTypeId_fkey` FOREIGN KEY (`fileTypeId`) REFERENCES `FileTypeMap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
