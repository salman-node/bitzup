import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as bip32 from "bip32";
import { bufferToHex } from "ethereumjs-util";
import { hdkey } from '@ethereumjs/wallet'
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";

import pool from "../connection/dbConnection.js";

export const generateAddress = async (req, res) => {
    try {
        const { user_id, evm_compatible, chain_id } = req.body;
        if (!user_id || !chain_id) {
            return res.status(200).json({ success: "0", message: "Missing required fields" });
        }

        // Check if the user already has an address
        let existingAddress;
        if (evm_compatible == 1) {
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

        if (evm_compatible == 1 && chain_id != "1111" && chain_id != "110" && chain_id != "111") {

            // Generate new wallet
            let mnemonic, wallet;

            try {
                mnemonic = bip39.generateMnemonic();
                wallet = hdkey.EthereumHDKey.fromMnemonic(mnemonic);
                const privateKey = wallet.getWallet().getPrivateKey();
                address = wallet.getWallet().getAddressString();
                key = bufferToHex(privateKey);
            } catch (walletError) {
                throw new Error("Error generating address: " + walletError.message);
            }

        } else if (evm_compatible == 0 && (chain_id == "1111" || chain_id == "110" || chain_id == "111")) {
            if (chain_id == "1111") {
                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                address = publicKey;
                const secretKeyHex = Buffer.from(keypair.secretKey).toString("hex");
                const recoveredPrivateKey = Buffer.from(secretKeyHex, "hex");
                key = bs58.encode(recoveredPrivateKey);
            } else if (chain_id == "110") {
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
            } else if (chain_id == "111") {
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

        // Insert into second DB
        await pool.query(
            `INSERT INTO addresses (user_id, evm_compatible, chain_id, address, pvt_key) VALUES (?, ?, ?, ?, ?)`,
            [user_id, evm_compatible, chain_id, address, key]
        );

        const encryptedData = {
            user_id: user_id,
            evm_compatible: evm_compatible,
            chain_id: chain_id,
            address: address,
        };

        // const response = await axios.post(process.env.WEBHOOK_URL, encryptedData, {
        //     headers: {
        //       "Content-Type": "application/json",
        //       "Authorization": `Bearer ${process.env.WEBHOOK_TOKEN}`,
        //     },
        // });

        return res.status(200).json({
            success: "1",
            message: "Wallet address generated successfully",
            data: {
                address: address,
            },
        });
    }
    catch (error) {
        console.error("Error generating address:", error);
        return res.status(200).json({
            success: "0",
            message: "Internal server error.",
        });
    }
}

