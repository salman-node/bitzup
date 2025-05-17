import axios from "axios";
import fs from "fs";
import path from "path";
import pool from "../connection/dbConnection.js";
import dotenv from "dotenv";
import { chainData } from "../config/constant.js";
dotenv.config();

console.log(__dirname)

// Trackers directory
function getTrackerFile(chainId) {
    return path.join(__dirname, `lastChecked_${chainId}_Block.json`);
}

function readLastCheckedBlock(chainId) {
    const filePath = getTrackerFile(chainId);
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ lastCheckedBlock: -1 }, null, 2));
            return -1;
        }
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return data.lastCheckedBlock ?? -1;
    } catch (err) {
        console.warn(`⚠️ Error reading tracker for chain ${chainId}:`, err.message);
        return -1;
    }
}

function writeLastCheckedBlock(chainId, blockHeight) {
    const filePath = getTrackerFile(chainId);
    try {
        fs.writeFileSync(filePath, JSON.stringify({ lastCheckedBlock: blockHeight }, null, 2));
    } catch (err) {
        console.error(`🚫 Error writing tracker for chain ${chainId}:`, err.message);
    }
}


async function callRPC(rpcUrl, method, params = []) {
    try {
        const response = await axios.post(rpcUrl, {
            jsonrpc: '2.0',
            id: 1,
            method,
            params,
        }, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.error) throw new Error(response.data.error.message);
        return response.data.result;
    } catch (err) {
        console.error(`❌ RPC Error [${method}] - ${rpcUrl}:`, err.message);
        throw err;
    }
}

async function getWatchedAddressesByChain() {
    const rows = await pool.query(`
    SELECT address, chain_id 
    FROM addresses 
    WHERE evm_compatible = 1
  `);

    return rows;
}

async function scanBlock(chainId, rpcUrl, blockNumber, watchAddresses) {
    const blockHex = '0x' + blockNumber.toString(16);
    const block = await callRPC(rpcUrl, 'eth_getBlockByNumber', [blockHex, true]);

    if (!block || !block.transactions) return;

    for (const tx of block.transactions) {
        const to = tx.to?.toLowerCase();
        if (to && watchAddresses.includes(to)) {
            console.log(`🚀 [CHAIN ${chainId}] Deposit at ${to} | Block: ${blockNumber} | TX: ${tx.hash}`);
            // 👉 You can insert into a DB or emit WebSocket event here
            await pool.query(`
                INSERT INTO deposits (tx_hash, to_address, from_address, value,evm_compatible, chain_id, block_number)
                VALUES (?, ?, ?, ?, ?, ?)
              `, [tx.hash, to, tx.from, parseInt(tx.value, 16) / 1e18,1, chainId, blockNumber]);
        }
    }
}

function startEvmMonitoring(interval = 15000) {
    setInterval(async () => {
        const groupedAddresses = await getWatchedAddressesByChain();

        for (const row of groupedAddresses) {
            const chainId = parseInt(row.chain_id);
            const chainInfo = chainData[chainId];

            if (!chainInfo?.rpcUrl) {
                console.warn(`⚠️ Skipping chain ${chainId} (no RPC URL)`);
                continue;
            }

            let lastCheckedBlock = readLastCheckedBlock(chainId);

            try {
                const latestBlockHex = await callRPC(chainInfo.rpcUrl, 'eth_blockNumber');
                const latestBlock = parseInt(latestBlockHex, 16);

                if (lastCheckedBlock === -1) lastCheckedBlock = latestBlock - 1;

                if (latestBlock > lastCheckedBlock) {
                    for (let block = lastCheckedBlock + 1; block <= latestBlock; block++) {
                        await scanBlock(chainId, chainInfo.rpcUrl, block, row.address);
                    }

                    writeLastCheckedBlock(chainId, latestBlock);
                } else {
                    console.log(`⏳ Chain ${chainId}: No new blocks`);
                }
            } catch (err) {
                console.error(`🚫 Error for chain ${chainId}:`, err.message);
            }
        }
    }, interval);
}

startEvmMonitoring(15000);
