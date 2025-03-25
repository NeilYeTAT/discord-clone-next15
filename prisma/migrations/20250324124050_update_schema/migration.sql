/*
  Warnings:

  - You are about to drop the column `fileType` on the `DirectMessage` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DirectMessage` DROP COLUMN `fileType`,
    ADD COLUMN `fileTypeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `fileType`,
    ADD COLUMN `fileTypeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `FileType` (
    `id` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(10) NULL,

    UNIQUE INDEX `FileType_fileUrl_key`(`fileUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_fileTypeId_fkey` FOREIGN KEY (`fileTypeId`) REFERENCES `FileType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessage` ADD CONSTRAINT `DirectMessage_fileTypeId_fkey` FOREIGN KEY (`fileTypeId`) REFERENCES `FileType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
