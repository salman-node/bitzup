import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as bip32 from "bip32";
import { bufferToHex } from "ethereumjs-util";
import pkg from "ethereumjs-wallet";
const { hdkey } = pkg;
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

import poolServer from "../connection/dbConnection-server.js";
import pool from "../connection/dbConnection.js";

export const generateAddress = async (req, res) => {
    try {
        const { user_id, evm_compatible, chain_id } = req.body;
        if (!user_id || !chain_id) {
            return res.status(200).json({ success: "0", message: "Missing required fields" });
        }

        // Check if the user already has an address
        let existingAddress;
        if (evm_compatible === 1) {
            existingAddress = await pool.query(
                `SELECT address FROM addresses WHERE user_id = ? AND evm_compatible = 1`,
                [user_id]
            );
        } else {
            existingAddress = await pool.query(
                `SELECT address FROM addresses WHERE user_id = ? AND evm_compatible = 0 AND chain_id = ?`,
                [user_id, chain_id]
            );
        }

        if (existingAddress.length > 0) {
            return res.status(200).json({
                success: "1",
                message: "Address already exists",
                data: {
                    address: existingAddress[0].address,
                },
            });
        }

        let key, address;

        if (evm_compatible === 1 && chain_id !== "1111" && chain_id !== "110" && chain_id !== "111") {

            // Generate new wallet
            let mnemonic, seed, hdWallet, wallet;

            try {
                mnemonic = bip39.generateMnemonic();
                seed = bip39.mnemonicToSeedSync(mnemonic);
                hdWallet = hdkey.fromMasterSeed(seed);
                wallet = hdWallet.derivePath("m/44'/60'/0'/0/0").getWallet();
                address = bufferToHex(wallet.getAddress());
                key = bufferToHex(wallet.getPrivateKey());
            } catch (walletError) {
                throw new Error("Error generating address: " + walletError.message);
            }

        } else if (evm_compatible === 0 && (chain_id === "1111" || chain_id === "110" || chain_id === "111")) {
            if (chain_id === "1111") {
                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                address = publicKey;
                const secretKeyHex = Buffer.from(keypair.secretKey).toString("hex");
                const recoveredPrivateKey = Buffer.from(secretKeyHex, "hex");
                key = bs58.encode(recoveredPrivateKey);
            } else if (chain_id === "110") {
                let mnemonic = bip39.generateMnemonic();
                const network = bitcoin.networks.testnet;  // mainnet for use bitcoin.networks.bitcoin
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const root = bip32.fromSeed(seed, network);
                // SegWit: BIP84 (m/84'/0'/0'/0/0)
                const segwitPath = "m/84'/0'/0'/0/0";
                const segwitChild = root.derivePath(segwitPath);
                const segwit = bitcoin.payments.p2wpkh({
                    pubkey: segwitChild.publicKey,
                    network,
                });
                address = segwit.address;
                key = segwitChild.toWIF();
            } else if (chain_id === "111") {
                let mnemonic = bip39.generateMnemonic();
                const network = bitcoin.networks.testnet;  // mainnet for use bitcoin.networks.bitcoin
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const root = bip32.fromSeed(seed, network);
                // Legacy: BIP44 (m/44'/0'/0'/0/0)
                const legacyPath = "m/44'/0'/0'/0/0";
                const legacyChild = root.derivePath(legacyPath);
                const legacy = bitcoin.payments.p2pkh({
                    pubkey: legacyChild.publicKey,
                    network,
                });
                address = legacy.address;
                key = legacyChild.toWIF();
            } else {
                return res.status(200).json({ success: "0", message: "Invalid chain_id" });
            }
        } else {
            return res.status(200).json({ success: "0", message: "Invalid chain_id" });
        }

        // await poolServer.query(
        //     `INSERT INTO addresses (address, pvt_key) VALUES (?, ?)`,
        //     [address, key]
        // );

        // await pool.query(
        //     `INSERT INTO addresses (user_id, address, evm_compatible,chain_id) VALUES (?, ?, ?, ?)`,
        //     [user_id, address, evm_compatible, chain_id]
        // );

        const connection = await pool.getConnection();
        const serverConnection = await poolServer.getConnection();

        try {
            // Start transactions on both databases
            await connection.beginTransaction();
            await serverConnection.beginTransaction();

            // Insert into first DB
            await connection.query(
                `INSERT INTO addresses (user_id, address, evm_compatible, chain_id) VALUES (?, ?, ?, ?)`,
                [user_id, address, evm_compatible, chain_id]
            );

            // Insert into second DB
            await serverConnection.query(
                `INSERT INTO addresses (address, pvt_key) VALUES (?, ?)`,
                [address, key]
            );

            // Commit both
            await connection.commit();
            await serverConnection.commit();

            return res.status(200).json({
                success: "1",
                message: "Wallet address generated successfully",
                data: {
                    address: address,
                },
            });
        } catch (err) {
            // Rollback both if any error occurs
            await connection.rollback();
            await serverConnection.rollback();
            console.error("Transaction failed:", err.message);

            return res.status(500).json({
                success: "0",
                message: "Failed to generate address",
            });
        } finally {
            // Always release connections
            connection.release();
            serverConnection.release();
        }
    }
    catch (error) {
        console.error("Error generating address:", error);
        return res.status(200).json({
            success: "0",
            message: "Internal server error.",
        });
    }
}

