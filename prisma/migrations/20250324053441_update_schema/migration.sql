/*
  Warnings:

  - You are about to alter the column `fileType` on the `FileTypeMap` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `FileTypeMap` MODIFY `fileType` VARCHAR(191) NOT NULL;
