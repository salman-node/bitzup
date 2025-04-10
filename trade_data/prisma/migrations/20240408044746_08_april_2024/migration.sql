/*
  Warnings:

  - You are about to drop the column `cancelled_date_time` on the `buy_sell_pro_in_order` table. All the data in the column will be lost.
  - You are about to drop the column `executed_quantity` on the `buy_sell_pro_in_order` table. All the data in the column will be lost.
  - You are about to alter the column `usdtprice` on the `currencies` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,12)` to `Decimal(30,8)`.
  - Added the required column `fcm_token` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secret_key` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opening_balance` to the `wallet_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `buy_sell_pro_in_order` DROP COLUMN `cancelled_date_time`,
    DROP COLUMN `executed_quantity`;

-- AlterTable
ALTER TABLE `chains` ADD COLUMN `evm_compatible` ENUM('ZERO', 'ONE') NOT NULL DEFAULT 'ZERO',
    ADD COLUMN `min_dep` DECIMAL(15, 8) NOT NULL DEFAULT 0.00000000;

-- AlterTable
ALTER TABLE `currencies` ADD COLUMN `price_decimal` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `qty_decimal` INTEGER NOT NULL DEFAULT 0,
    MODIFY `usdtprice` DECIMAL(30, 8) NOT NULL;

-- AlterTable
ALTER TABLE `deposit_history` ADD COLUMN `status` ENUM('SUCCESS', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `fcm_token` VARCHAR(191) NOT NULL,
    ADD COLUMN `secret_key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `wallet_history` ADD COLUMN `opening_balance` DECIMAL(30, 8) NOT NULL;

-- AlterTable
ALTER TABLE `withdrawl_history` ADD COLUMN `status` ENUM('SUCCESS', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `crypto_tds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `order_id` VARCHAR(30) NOT NULL,
    `tds` DECIMAL(10, 2) NOT NULL,
    `rate` DECIMAL(30, 8) NOT NULL,
    `date_time` DOUBLE NOT NULL,

    UNIQUE INDEX `crypto_tds_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
