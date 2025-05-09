-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phonecode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coin` VARCHAR(50) NOT NULL,
    `coin_decimal` INTEGER NOT NULL DEFAULT 0,
    `symbol` VARCHAR(10) NOT NULL,
    `icon` VARCHAR(15) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL,
    `pro_api_id` INTEGER NOT NULL DEFAULT 1,
    `trade_status` INTEGER NOT NULL DEFAULT 1,
    `limit_order` INTEGER NOT NULL DEFAULT 0,
    `pro_trade` INTEGER NOT NULL DEFAULT 0,
    `usdtprice` DECIMAL(30, 12) NOT NULL,
    `change_in_price` FLOAT NOT NULL,
    `chain` VARCHAR(25) NOT NULL DEFAULT '',
    `column_name` VARCHAR(50) NOT NULL DEFAULT '',
    `table_column` VARCHAR(50) NOT NULL DEFAULT '',
    `coin_name` VARCHAR(50) NOT NULL DEFAULT '',
    `popular` INTEGER NOT NULL DEFAULT 0,
    `hot` INTEGER NOT NULL DEFAULT 0,
    `withdrawl_fees` DECIMAL(30, 12) NOT NULL,
    `withdraw` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Inactive',
    `deposit` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Inactive',
    `ext_withdraw` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Inactive',
    `bnbchain` VARCHAR(30) NOT NULL DEFAULT '',
    `decimal` INTEGER NOT NULL DEFAULT 6,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoritecurrency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency` VARCHAR(191) NOT NULL,
    `base` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `balance` DECIMAL(65, 30) NOT NULL,
    `locked_value` INTEGER NOT NULL,

    INDEX `user_coin_index`(`user_id`, `coin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balances_inorder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `balances` DECIMAL(65, 30) NOT NULL,

    INDEX `user_coin_index`(`user_id`, `coin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chains` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coin_id` INTEGER NOT NULL,
    `chain_name` VARCHAR(191) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `min_with` DECIMAL(15, 8) NOT NULL DEFAULT 0.00000000,
    `netw_fee` DECIMAL(15, 8) NOT NULL DEFAULT 0.00000000,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `destination_tag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `addresses_user_id_coin_id_chain_id_key`(`user_id`, `coin_id`, `chain_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `type` ENUM('cr', 'dr') NOT NULL,
    `remaining_balance` DECIMAL(30, 8) NOT NULL,
    `balance` DECIMAL(30, 8) NOT NULL,
    `remark` ENUM('BUY', 'SELL', 'DEPOSIT', 'WITHDRAW', 'CANCELLED') NOT NULL,
    `order_id` VARCHAR(20) NOT NULL,
    `date_time` DOUBLE NOT NULL,

    UNIQUE INDEX `wallet_history_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buy_fees` DECIMAL(30, 8) NOT NULL,
    `sell_fees` DECIMAL(30, 8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `destination_tag` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(30, 3) NOT NULL,
    `fiat_amount` DECIMAL(30, 8) NOT NULL,
    `fees` DECIMAL(30, 8) NOT NULL,
    `final_amount` DECIMAL(30, 8) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `deposit_history_user_id_coin_id_chain_id_key`(`user_id`, `coin_id`, `chain_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdrawl_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `destination_tag` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(30, 3) NOT NULL,
    `fiat_amount` DECIMAL(30, 8) NOT NULL,
    `fees` DECIMAL(30, 8) NOT NULL,
    `final_amount` DECIMAL(30, 8) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `withdrawl_history_user_id_coin_id_chain_id_date_key`(`user_id`, `coin_id`, `chain_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_sell_pro_limit_open` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `coin_base` ENUM('USDT', 'INR') NOT NULL DEFAULT 'INR',
    `type` ENUM('BUY', 'SELL') NOT NULL,
    `usdt_price` DECIMAL(30, 12) NOT NULL,
    `quantity` DECIMAL(30, 12) NOT NULL,
    `amount` DECIMAL(30, 12) NOT NULL,
    `executed_quantity` DECIMAL(30, 12) NOT NULL,
    `stop_limit_price` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `oco_stop_limit_price` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `tds` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `fees` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `final_amount` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `order_id` VARCHAR(100) NOT NULL,
    `api_order_id` VARCHAR(100) NOT NULL DEFAULT '',
    `order_type` ENUM('LIMIT', 'MARKET', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT', 'OCO', 'STOP_LIMIT') NOT NULL,
    `status` ENUM('FILLED', 'PENDING', 'CANCELLED', 'OPEN') NOT NULL DEFAULT 'OPEN',
    `api_id` INTEGER NOT NULL DEFAULT 0,
    `response` VARCHAR(191) NULL,
    `date_time` DOUBLE NOT NULL,
    `cancelled_date_time` DOUBLE NULL,
    `response_time` VARCHAR(50) NOT NULL DEFAULT '',
    `profit` DECIMAL(10, 5) NOT NULL DEFAULT 0.00000,
    `api` INTEGER NOT NULL DEFAULT 0,
    `device` VARCHAR(30) NULL,

    UNIQUE INDEX `buy_sell_pro_limit_open_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_sell_pro_in_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `coin_base` ENUM('USDT', 'INR') NOT NULL DEFAULT 'INR',
    `type` ENUM('BUY', 'SELL') NOT NULL,
    `usdt_price` DECIMAL(30, 12) NOT NULL,
    `quantity` DECIMAL(30, 12) NOT NULL,
    `amount` DECIMAL(30, 12) NOT NULL,
    `executed_quantity` DECIMAL(30, 12) NOT NULL,
    `stop_limit_price` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `oco_stop_limit_price` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `tds` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `fees` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `final_amount` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `order_id` VARCHAR(100) NOT NULL,
    `api_order_id` VARCHAR(100) NOT NULL DEFAULT '',
    `order_type` ENUM('LIMIT', 'MARKET', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT', 'OCO', 'STOP_LIMIT') NOT NULL,
    `status` ENUM('FILLED', 'PENDING', 'CANCELLED', 'OPEN') NOT NULL DEFAULT 'OPEN',
    `api_id` INTEGER NOT NULL DEFAULT 0,
    `response` VARCHAR(191) NOT NULL,
    `date_time` DOUBLE NOT NULL,
    `cancelled_date_time` DOUBLE NOT NULL,
    `response_time` VARCHAR(50) NOT NULL DEFAULT '',
    `profit` DECIMAL(10, 5) NOT NULL DEFAULT 0.00000,
    `api` INTEGER NOT NULL DEFAULT 0,
    `device` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `buy_sell_pro_in_order_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_sell_order_response` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(50) NOT NULL,
    `api_order_id` VARCHAR(50) NOT NULL,
    `response` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loginsession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `failedLogin` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoginSession_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `opt` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `expiresAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banner_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('Active', 'Inactive') NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `device_id` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favoritecurrency` ADD CONSTRAINT `favoritecurrency_id_fkey` FOREIGN KEY (`id`) REFERENCES `currencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `balances` ADD CONSTRAINT `balances_coin_id_fkey` FOREIGN KEY (`coin_id`) REFERENCES `currencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chains` ADD CONSTRAINT `chains_coin_id_fkey` FOREIGN KEY (`coin_id`) REFERENCES `currencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deposit_history` ADD CONSTRAINT `deposit_history_chain_id_fkey` FOREIGN KEY (`chain_id`) REFERENCES `chains`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `withdrawl_history` ADD CONSTRAINT `withdrawl_history_chain_id_fkey` FOREIGN KEY (`chain_id`) REFERENCES `chains`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
