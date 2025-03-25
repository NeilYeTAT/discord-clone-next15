/*
  Warnings:

  - You are about to drop the column `fileTypeId` on the `DirectMessage` table. All the data in the column will be lost.
  - You are about to drop the column `fileTypeId` on the `Message` table. All the data in the column will be lost.

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
ALTER TABLE `DirectMessage` DROP COLUMN `fileTypeId`,
    ADD COLUMN `fileType` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `fileTypeId`,
    ADD COLUMN `fileType` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_fileType_fkey` FOREIGN KEY (`fileType`) REFERENCES `FileTypeMap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessage` ADD CONSTRAINT `DirectMessage_fileType_fkey` FOREIGN KEY (`fileType`) REFERENCES `FileTypeMap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
