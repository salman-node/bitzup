/*
  Warnings:

  - The `created_at` column on the `balances` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `chain_name` on the `chains` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `evm_compatible` on the `chains` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(7))`.
  - The values [active,inactive] on the enum `chains_withdrawal_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,inactive] on the enum `chains_deposit_status` will be removed. If these variants are still used in the database, this will fail.
  - The `created_at` column on the `crypto_pair` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `networks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chain_id,chain_name]` on the table `chains` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `coin_id` ON `chains`;

-- AlterTable
ALTER TABLE `balances` DROP COLUMN `created_at`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `chains` MODIFY `chain_name` VARCHAR(20) NOT NULL,
    MODIFY `evm_compatible` ENUM('ONE', 'ZERO') NOT NULL DEFAULT 0,
    MODIFY `withdrawal_status` ENUM('Active', 'Inactive') NOT NULL,
    MODIFY `deposit_status` ENUM('Active', 'Inactive') NOT NULL;

-- AlterTable
ALTER TABLE `crypto_pair` DROP COLUMN `created_at`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `anti_phishing_code` VARCHAR(32) NULL,
    ADD COLUMN `referral_url` VARCHAR(150) NULL,
    DROP COLUMN `created_at`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- DropTable
DROP TABLE `networks`;

-- CreateIndex
CREATE UNIQUE INDEX `coin_id` ON `chains`(`chain_id`, `chain_name`);
