const io = require('socket.io-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Connect to the database
    await prisma.$connect();

    // Retrieve data from an existing table
    const marketData = await prisma.currencies.findMany();
    // console.log(`Retrieved ${JSON.stringify(marketData)} market data entries`);

    // Disconnect from the database
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
  }
}

main();

const socket = io('https://websocket-v2-jrkzj.ondigitalocean.app', {
    withCredentials: true
});

// Emit 'marketFetchdata' event after connecting
socket.on('connect', () => {
    console.log('Connected to the WebSocket server');
    socket.emit('marketFetchdata');
});

// Listen for 'marketData' event and display the received data
socket.on('marketData', (data) => {
    console.log('Received market data:', data);
    // const usdtData = data.usdt.data;
    // console.log(usdtData)

    usdtData.forEach(async(data) => {
        const updatedRecord = await prisma.currencies.update({
            where: {
              id: parseInt(data.coin_id), // Update the record with id = 1
            },
            data: {
              usdtprice: data.usdtprice,
              change_in_price: parseFloat(data.change_in_price),
            },
          }); 
        console.log(`Symbol: ${data.symbol}, Price: ${data.usdtprice}, Timestamp: ${new Date().toLocaleTimeString()}`);
    }); 
   
});

socket.emit('coinData', (data) => {
    console.log('Received market data:', data);
    const usdtData = data.usdt.data;
    console.log(usdtData)

    // usdtData.forEach(async(data) => {
    //     const updatedRecord = await prisma.currencies.update({
    //         where: {
    //           id: parseInt(data.coin_id), // Update the record with id = 1
    //         },
    //         data: {
    //           usdtprice: data.usdtprice,
    //           change_in_price: parseFloat(data.change_in_price),
    //         },
    //       }); 
    //     console.log(`Symbol: ${data.symbol}, Price: ${data.usdtprice}, Timestamp: ${new Date().toLocaleTimeString()}`);
    // }); 
   

});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from the WebSocket server');
});

