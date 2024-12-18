/*
  Warnings:

  - Added the required column `tds` to the `fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `buy_sell_pro_limit_open` ADD COLUMN `buy_sell_fees` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000;

-- AlterTable
ALTER TABLE `fees` ADD COLUMN `tds` DECIMAL(30, 8) NOT NULL;
