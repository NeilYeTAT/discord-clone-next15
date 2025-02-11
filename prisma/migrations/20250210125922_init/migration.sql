/*
  Warnings:

  - You are about to drop the column `cratedAt` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `cratedAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `cratedAt` on the `Server` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Channel` DROP COLUMN `cratedAt`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Member` DROP COLUMN `cratedAt`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Server` DROP COLUMN `cratedAt`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
