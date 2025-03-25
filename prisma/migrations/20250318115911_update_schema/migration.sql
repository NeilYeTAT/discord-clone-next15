/*
  Warnings:

  - You are about to drop the column `fileType` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DirectMessage` ADD COLUMN `fileTypeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `fileType`,
    ADD COLUMN `fileTypeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `FileTypeMap` (
    `id` VARCHAR(191) NOT NULL,
    `fileUrl` TEXT NOT NULL,
    `fileType` ENUM('IMAGE', 'PDF') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_fileTypeId_fkey` FOREIGN KEY (`fileTypeId`) REFERENCES `FileTypeMap`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessage` ADD CONSTRAINT `DirectMessage_fileTypeId_fkey` FOREIGN KEY (`fileTypeId`) REFERENCES `FileTypeMap`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
