/*
  Warnings:

  - You are about to alter the column `memo` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `address` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `destination_tag` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `balance` on the `balances` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(30,8)`.
  - You are about to alter the column `balances` on the `balances_inorder` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(30,8)`.
  - You are about to alter the column `name` on the `banner_image` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `status` on the `buy_sell_pro_in_order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(14))` to `Enum(EnumId(18))`.
  - You are about to alter the column `chain_name` on the `chains` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `date` on the `deposit_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `memo` on the `deposit_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `address` on the `deposit_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `destination_tag` on the `deposit_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `amount` on the `deposit_history` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,3)` to `Decimal(20,3)`.
  - You are about to alter the column `transaction_id` on the `deposit_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `email` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the column `opt` on the `otp` table. All the data in the column will be lost.
  - The primary key for the `withdrawl_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `date` on the `withdrawl_history` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `memo` on the `withdrawl_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `address` on the `withdrawl_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `destination_tag` on the `withdrawl_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `amount` on the `withdrawl_history` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,3)` to `Decimal(20,3)`.
  - You are about to alter the column `transaction_id` on the `withdrawl_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `loginsession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,coin_id]` on the table `balances` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,coin_id]` on the table `balances_inorder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coin_id,chain_name]` on the table `chains` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `withdrawl_history` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coin_id,chain_id,date,user_id]` on the table `withdrawl_history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tds_perc` to the `crypto_tds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp` to the `otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `balances` DROP FOREIGN KEY `balances_coin_id_fkey`;

-- DropForeignKey
ALTER TABLE `chains` DROP FOREIGN KEY `chains_coin_id_fkey`;

-- DropForeignKey
ALTER TABLE `deposit_history` DROP FOREIGN KEY `deposit_history_chain_id_fkey`;

-- DropForeignKey
ALTER TABLE `favoritecurrency` DROP FOREIGN KEY `favoritecurrency_id_fkey`;

-- DropForeignKey
ALTER TABLE `withdrawl_history` DROP FOREIGN KEY `withdrawl_history_chain_id_fkey`;

-- DropIndex
DROP INDEX `user_coin_index` ON `balances`;

-- DropIndex
DROP INDEX `user_coin_index` ON `balances_inorder`;

-- DropIndex
DROP INDEX `buy_sell_pro_in_order_order_id_key` ON `buy_sell_pro_in_order`;

-- DropIndex
DROP INDEX `crypto_tds_order_id_key` ON `crypto_tds`;

-- DropIndex
DROP INDEX `wallet_history_order_id_key` ON `wallet_history`;

-- DropIndex
DROP INDEX `withdrawl_history_user_id_coin_id_chain_id_date_key` ON `withdrawl_history`;

-- AlterTable
ALTER TABLE `addresses` MODIFY `memo` VARCHAR(50) NOT NULL,
    MODIFY `address` VARCHAR(50) NOT NULL,
    MODIFY `destination_tag` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `balances` MODIFY `user_id` VARCHAR(20) NOT NULL,
    MODIFY `balance` DECIMAL(30, 8) NOT NULL;

-- AlterTable
ALTER TABLE `balances_inorder` MODIFY `user_id` VARCHAR(20) NOT NULL,
    MODIFY `balances` DECIMAL(30, 8) NOT NULL;

-- AlterTable
ALTER TABLE `banner_image` MODIFY `name` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `buy_sell_order_response` MODIFY `api_order_id` VARCHAR(50) NOT NULL DEFAULT '',
    MODIFY `response` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `buy_sell_pro_in_order` MODIFY `coin_base` ENUM('INR', 'USDT') NOT NULL DEFAULT 'INR',
    MODIFY `status` ENUM('FILLED', 'PARTIALLY') NOT NULL DEFAULT 'FILLED',
    MODIFY `response` TEXT NULL,
    MODIFY `date_time` DOUBLE NOT NULL DEFAULT (current_timestamp()),
    MODIFY `device` VARCHAR(30) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `buy_sell_pro_limit_open` MODIFY `coin_base` ENUM('INR', 'USDT') NOT NULL DEFAULT 'INR',
    MODIFY `response` TEXT NULL,
    MODIFY `date_time` DOUBLE NOT NULL DEFAULT (current_timestamp());

-- AlterTable
ALTER TABLE `chains` MODIFY `chain_name` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `crypto_tds` ADD COLUMN `tds_perc` DECIMAL(10, 2) NOT NULL,
    MODIFY `rate` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    MODIFY `date_time` DOUBLE NOT NULL DEFAULT (current_timestamp());

-- AlterTable
ALTER TABLE `currencies` ADD COLUMN `chart_id` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `deposit_history` MODIFY `date` DATETIME(0) NOT NULL,
    MODIFY `memo` VARCHAR(50) NOT NULL,
    MODIFY `address` VARCHAR(50) NOT NULL,
    MODIFY `destination_tag` VARCHAR(50) NOT NULL,
    MODIFY `amount` DECIMAL(20, 3) NOT NULL,
    MODIFY `transaction_id` VARCHAR(100) NOT NULL,
    MODIFY `status` ENUM('SUCCESS', 'PENDING', 'CANCELLED') NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `favoritecurrency` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `user_id` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `otp` DROP COLUMN `email`,
    DROP COLUMN `opt`,
    ADD COLUMN `otp` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `lockout_time` TIMESTAMP(0) NULL,
    ADD COLUMN `login_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `otp_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `user_id` VARCHAR(20) NOT NULL,
    MODIFY `secret_key` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `withdrawl_history` DROP PRIMARY KEY,
    MODIFY `date` DATETIME(0) NOT NULL,
    MODIFY `memo` VARCHAR(50) NOT NULL,
    MODIFY `address` VARCHAR(50) NOT NULL,
    MODIFY `destination_tag` VARCHAR(50) NOT NULL,
    MODIFY `amount` DECIMAL(20, 3) NOT NULL,
    MODIFY `transaction_id` VARCHAR(100) NOT NULL,
    MODIFY `status` ENUM('SUCCESS', 'PENDING', 'CANCELLED') NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `loginsession`;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `secretKey` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `status` ENUM('ZERO', 'ONE') NOT NULL DEFAULT 'ONE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_id` ON `balances`(`user_id`, `coin_id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_id` ON `balances_inorder`(`user_id`, `coin_id`);

-- CreateIndex
CREATE INDEX `coin_id` ON `buy_sell_pro_limit_open`(`coin_id`);

-- CreateIndex
CREATE INDEX `user_id` ON `buy_sell_pro_limit_open`(`user_id`);

-- CreateIndex
CREATE INDEX `user_id_2` ON `buy_sell_pro_limit_open`(`user_id`, `coin_id`, `order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `coin_id` ON `chains`(`coin_id`, `chain_name`);

-- CreateIndex
CREATE INDEX `symbol` ON `currencies`(`symbol`);

-- CreateIndex
CREATE INDEX `user_id` ON `user`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `id` ON `withdrawl_history`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `coin_id` ON `withdrawl_history`(`coin_id`, `chain_id`, `date`, `user_id`);

-- AddForeignKey
ALTER TABLE `balances` ADD CONSTRAINT `balances_ibfk_2` FOREIGN KEY (`coin_id`) REFERENCES `currencies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- RedefineIndex
CREATE UNIQUE INDEX `user_id_2` ON `addresses`(`user_id`, `coin_id`, `chain_id`);
DROP INDEX `addresses_user_id_coin_id_chain_id_key` ON `addresses`;

-- RedefineIndex
CREATE INDEX `coin_id` ON `balances`(`coin_id`);
DROP INDEX `balances_coin_id_fkey` ON `balances`;

-- RedefineIndex
CREATE UNIQUE INDEX `order_id` ON `buy_sell_pro_limit_open`(`order_id`);
DROP INDEX `buy_sell_pro_limit_open_order_id_key` ON `buy_sell_pro_limit_open`;

-- RedefineIndex
CREATE UNIQUE INDEX `user_id` ON `deposit_history`(`user_id`, `coin_id`, `chain_id`);
DROP INDEX `deposit_history_user_id_coin_id_chain_id_key` ON `deposit_history`;
