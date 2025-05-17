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
    `currency_id` VARCHAR(20) NOT NULL,
    `coin` VARCHAR(50) NOT NULL,
    `decimal` INTEGER NOT NULL DEFAULT 6,
    `coin_decimal` INTEGER NOT NULL DEFAULT 0,
    `qty_decimal` INTEGER NOT NULL DEFAULT 0,
    `price_decimal` INTEGER NOT NULL DEFAULT 0,
    `symbol` VARCHAR(10) NOT NULL,
    `icon` VARCHAR(15) NOT NULL,
    `chart_id` VARCHAR(50) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL,
    `pro_api_id` INTEGER NOT NULL DEFAULT 1,
    `trade_status` INTEGER NOT NULL DEFAULT 1,
    `limit_order` INTEGER NOT NULL DEFAULT 0,
    `pro_trade` INTEGER NOT NULL DEFAULT 0,
    `usdtprice` DECIMAL(30, 8) NOT NULL,
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

    UNIQUE INDEX `currency_id_UNIQUE`(`currency_id`),
    INDEX `symbol`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoritecurrency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pair_id` VARCHAR(30) NOT NULL,
    `user_id` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `currency_id` VARCHAR(20) NOT NULL,
    `main_balance` DECIMAL(30, 18) NOT NULL DEFAULT 0.000000000000000000,
    `locked_balance` DECIMAL(30, 18) NOT NULL DEFAULT 0.000000000000000000,
    `current_balance` DECIMAL(30, 18) NOT NULL DEFAULT 0.000000000000000000,
    `created_at` INTEGER NOT NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `user_id`(`user_id`, `currency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balances_inorder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `balances` DECIMAL(30, 8) NOT NULL,

    UNIQUE INDEX `user_id`(`user_id`, `coin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chains` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chain_id` INTEGER NOT NULL,
    `chain_name` VARCHAR(50) NOT NULL,
    `evm_compatible` BOOLEAN NOT NULL,
    `withdrawal_status` ENUM('active', 'inactive') NOT NULL,
    `deposit_status` ENUM('active', 'inactive') NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `min_with` DECIMAL(15, 8) NOT NULL DEFAULT 0.00000000,
    `min_dep` DECIMAL(15, 8) NOT NULL DEFAULT 0.00000000,
    `netw_fee` DECIMAL(15, 8) NOT NULL DEFAULT 0.00000000,

    UNIQUE INDEX `coin_id`(`chain_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `type` ENUM('cr', 'dr') NOT NULL,
    `opening_balance` DECIMAL(30, 8) NOT NULL,
    `remaining_balance` DECIMAL(30, 8) NOT NULL,
    `balance` DECIMAL(30, 8) NOT NULL,
    `remark` ENUM('BUY', 'SELL', 'DEPOSIT', 'WITHDRAW', 'CANCELLED') NOT NULL,
    `order_id` VARCHAR(20) NOT NULL,
    `date_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buy_fees` DECIMAL(30, 8) NOT NULL,
    `sell_fees` DECIMAL(30, 8) NOT NULL,
    `tds` DECIMAL(30, 8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `user_id` VARCHAR(35) NOT NULL,
    `coin_id` VARCHAR(35) NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `memo` VARCHAR(50) NOT NULL,
    `address` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(20, 8) NOT NULL,
    `final_amount` DECIMAL(30, 8) NOT NULL,
    `transaction_id` VARCHAR(100) NOT NULL,
    `status` ENUM('SUCCESS', 'PENDING', 'CANCELLED') NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdrawl_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `user_id` VARCHAR(35) NOT NULL,
    `coin_id` VARCHAR(35) NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `memo` VARCHAR(50) NOT NULL,
    `address` VARCHAR(50) NOT NULL,
    `destination_tag` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(20, 3) NOT NULL,
    `fiat_amount` DECIMAL(30, 8) NOT NULL,
    `fees` DECIMAL(30, 8) NOT NULL,
    `final_amount` DECIMAL(30, 8) NOT NULL,
    `transaction_id` VARCHAR(100) NOT NULL,
    `status` ENUM('SUCCESS', 'PENDING', 'CANCELLED') NULL DEFAULT 'PENDING',

    UNIQUE INDEX `id`(`id`),
    UNIQUE INDEX `coin_id`(`coin_id`, `chain_id`, `date`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_sell_pro_limit_open` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `pair_id` VARCHAR(20) NOT NULL,
    `type` ENUM('BUY', 'SELL') NOT NULL,
    `base_quantity` DECIMAL(30, 12) NOT NULL,
    `quote_quantity` DECIMAL(30, 12) NOT NULL,
    `order_price` DECIMAL(30, 12) NOT NULL,
    `executed_base_quantity` DECIMAL(30, 12) NOT NULL,
    `executed_quote_quantity` DECIMAL(30, 12) NOT NULL,
    `stop_limit_price` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `oco_stop_limit_price` DECIMAL(30, 8) NULL,
    `tds` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `fees` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `final_amount` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `order_id` VARCHAR(100) NOT NULL,
    `api_order_id` VARCHAR(100) NOT NULL DEFAULT '',
    `order_type` ENUM('LIMIT', 'MARKET', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT', 'OCO', 'STOP_LIMIT') NOT NULL,
    `buy_sell_fees` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `status` VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    `api_id` INTEGER NOT NULL DEFAULT 0,
    `response` TEXT NULL,
    `trade_id` INTEGER NOT NULL DEFAULT -1,
    `account_id` VARCHAR(50) NOT NULL,
    `date_time` BIGINT NULL,
    `cancelled_date_time` BIGINT NULL,
    `response_time` VARCHAR(50) NOT NULL DEFAULT '',
    `profit` DECIMAL(10, 5) NOT NULL DEFAULT 0.00000,
    `api` INTEGER NOT NULL DEFAULT 0,
    `device` VARCHAR(30) NULL,
    `created_at` INTEGER NOT NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `order_id`(`order_id`),
    INDEX `coin_id`(`pair_id`),
    INDEX `user_id`(`user_id`),
    INDEX `user_id_2`(`user_id`, `pair_id`, `order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_sell_pro_in_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(35) NOT NULL,
    `pair_id` VARCHAR(20) NOT NULL,
    `type` ENUM('BUY', 'SELL') NOT NULL,
    `base_quantity` DECIMAL(30, 12) NOT NULL,
    `quote_quantity` DECIMAL(30, 12) NOT NULL,
    `executed_base_quantity` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `executed_quote_quantity` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `order_price` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `executed_base_after_fees` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `executed_quote_after_fees` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `order_id` VARCHAR(100) NOT NULL,
    `api_order_id` VARCHAR(100) NOT NULL DEFAULT '',
    `order_type` ENUM('LIMIT', 'MARKET', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT', 'OCO', 'STOP_LIMIT') NOT NULL,
    `status` VARCHAR(25) NOT NULL DEFAULT 'NEW',
    `trade_id` INTEGER NOT NULL,
    `api_id` INTEGER NOT NULL DEFAULT 0,
    `date_time` BIGINT NULL,
    `buy_sell_fees` DECIMAL(30, 0) NOT NULL,
    `stop_limit_price` DECIMAL(30, 12) NOT NULL DEFAULT 0.000000000000,
    `api` VARCHAR(35) NOT NULL DEFAULT '0',
    `device` VARCHAR(30) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_sell_order_response` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(50) NOT NULL,
    `api_order_id` VARCHAR(50) NOT NULL DEFAULT '',
    `response` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_tds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coin_id` INTEGER NOT NULL,
    `order_id` VARCHAR(30) NOT NULL,
    `tds` DECIMAL(10, 2) NOT NULL,
    `rate` DECIMAL(30, 8) NOT NULL DEFAULT 0.00000000,
    `tds_perc` DECIMAL(10, 2) NOT NULL,
    `date_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `expiresAt` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banner_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('Active', 'Inactive') NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `uid` INTEGER NOT NULL,
    `created_at` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `withdrawal_password` VARCHAR(191) NULL,
    `withdrawal_pass_locktime` DATETIME(0) NULL,
    `token` VARCHAR(300) NULL,
    `token_string` VARCHAR(100) NOT NULL,
    `login_count` INTEGER NOT NULL DEFAULT 0,
    `otp_count` INTEGER NOT NULL DEFAULT 0,
    `lockout_time` TIMESTAMP(0) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `fcm_token` VARCHAR(191) NULL,
    `secret_key` LONGTEXT NULL,
    `isAuth` ENUM('Inactive', 'Active') NOT NULL DEFAULT 'Inactive',
    `device_id` VARCHAR(191) NULL,

    UNIQUE INDEX `user_id_2`(`user_id`),
    UNIQUE INDEX `uid`(`uid`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `networks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `network_id` VARCHAR(20) NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `symbol` INTEGER NOT NULL,
    `name` INTEGER NOT NULL,
    `icon_url` INTEGER NOT NULL,
    `quicknode_url` INTEGER NOT NULL,
    `explorer_url` INTEGER NOT NULL,
    `min_deposit` DOUBLE NOT NULL,
    `min_withdrawal` DOUBLE NOT NULL,
    `max_withdrawal` DOUBLE NOT NULL,
    `created_at` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,

    INDEX `network_id`(`network_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `currency_id` VARCHAR(35) NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `memo` VARCHAR(50) NOT NULL,
    `address` VARCHAR(50) NOT NULL,
    `destination_tag` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `user_id_2`(`user_id`, `currency_id`, `chain_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_pair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `base_asset_id` VARCHAR(20) NOT NULL,
    `quote_asset_id` VARCHAR(20) NOT NULL,
    `pair_symbol` VARCHAR(10) NOT NULL,
    `current_price` DOUBLE NOT NULL,
    `min_base_qty` DOUBLE NOT NULL,
    `max_base_qty` DOUBLE NOT NULL,
    `min_quote_qty` DOUBLE NOT NULL,
    `max_quote_qty` DOUBLE NOT NULL,
    `trade_fee` DOUBLE NOT NULL,
    `chart_id` VARCHAR(50) NOT NULL,
    `icon` VARCHAR(100) NOT NULL,
    `trade_status` INTEGER NOT NULL,
    `pro_trade` DOUBLE NOT NULL,
    `change_in_price` DOUBLE NOT NULL,
    `quantity_decimal` INTEGER NOT NULL,
    `price_decimal` INTEGER NOT NULL,
    `popular` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ZERO', 'ONE') NOT NULL DEFAULT 'ONE',
    `created_at` INTEGER NOT NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `unique_pair`(`base_asset_id`, `quote_asset_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(35) NOT NULL,
    `ip_address` VARCHAR(35) NOT NULL,
    `activity_type` VARCHAR(100) NOT NULL,
    `device_type` VARCHAR(50) NOT NULL,
    `device_info` VARCHAR(100) NOT NULL,
    `location` VARCHAR(250) NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buy_open_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(35) NOT NULL,
    `pair_id` VARCHAR(20) NOT NULL,
    `side` INTEGER NOT NULL,
    `price` DECIMAL(11, 0) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `executed_quantity` DOUBLE NOT NULL,
    `timestamp` VARCHAR(50) NULL,
    `status` ENUM('open', 'filled', 'partially_filled', 'canceled') NOT NULL DEFAULT 'open',
    `updated_at` TIMESTAMP(0) NULL,
    `uid` VARCHAR(35) NOT NULL,
    `user_id` VARCHAR(35) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matched_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(35) NOT NULL,
    `user_id` VARCHAR(35) NOT NULL,
    `pair_id` VARCHAR(35) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `executed_quantity` DOUBLE NOT NULL,
    `uid` VARCHAR(100) NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `side` INTEGER NOT NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sell_open_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(35) NOT NULL,
    `pair_id` VARCHAR(20) NOT NULL,
    `price` DOUBLE NOT NULL,
    `side` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `executed_quantity` DOUBLE NOT NULL,
    `uid` VARCHAR(35) NOT NULL,
    `hash` VARCHAR(100) NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` ENUM('open', 'filled', 'partially_filled', 'canceled') NOT NULL DEFAULT 'open',
    `updated_at` TIMESTAMP(0) NULL,
    `user_id` VARCHAR(35) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currency_network` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency_id` VARCHAR(35) NOT NULL,
    `network_id` INTEGER NOT NULL,
    `contract_address` VARCHAR(200) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `execution_reports` (
    `execution_id` BIGINT NOT NULL,
    `order_id` BIGINT NULL,
    `status` VARCHAR(50) NULL,
    `filled_quantity` DECIMAL(20, 8) NULL,
    `price` DECIMAL(20, 8) NULL,
    `event_time` BIGINT NULL,

    PRIMARY KEY (`execution_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
