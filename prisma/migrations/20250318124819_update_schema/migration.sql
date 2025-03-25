/*
  Warnings:

  - A unique constraint covering the columns `[fileUrl]` on the table `FileTypeMap` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `FileTypeMap` MODIFY `fileUrl` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FileTypeMap_fileUrl_key` ON `FileTypeMap`(`fileUrl`);
