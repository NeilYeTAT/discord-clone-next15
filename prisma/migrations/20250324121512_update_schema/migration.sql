/*
  Warnings:

  - You are about to alter the column `fileType` on the `DirectMessage` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `fileType` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to drop the `FileTypeMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DirectMessage` DROP FOREIGN KEY `DirectMessage_fileType_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_fileType_fkey`;

-- DropIndex
DROP INDEX `DirectMessage_fileType_fkey` ON `DirectMessage`;

-- DropIndex
DROP INDEX `Message_fileType_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `DirectMessage` MODIFY `fileType` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `Message` MODIFY `fileType` VARCHAR(10) NULL;

-- DropTable
DROP TABLE `FileTypeMap`;
