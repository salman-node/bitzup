-- AlterTable
ALTER TABLE `user` ADD COLUMN `isAuth` ENUM('Inactive', 'Active') NOT NULL DEFAULT 'Inactive';
