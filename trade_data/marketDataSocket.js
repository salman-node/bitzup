// const axios = require('axios');
// const http = require('http');
// const socketIo = require('socket.io');
// require('dotenv').config();

// const BitzUp_URL = 'http://localhost:1000/market-data';
// const server = http.createServer();

// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   cookie: {
//     sameSite: 'None',
//     secure: true
//   }
// });

// // === Track subscribers per event ===
// const subscribers = {
//   marketData: new Set(),
//   topGainers: new Set(),
//   topLosers: new Set(),
//   hotCurrencies: new Set()
// };

// // === Event URLs ===
// const eventUrls = {
//   marketData: `${BitzUp_URL}/marketData`,
//   topGainers: `${BitzUp_URL}/topGainers`,
//   topLosers: `${BitzUp_URL}/topLosers`,
//   hotCurrencies: `${BitzUp_URL}/hotCurrencies`
// };

// // === Polling Function ===
// const startPolling = (event, intervalTime) => {
//   setInterval(async () => {
//     if (subscribers[event].size === 0) return; // No clients subscribed

//     try {
//       console.log(`Fetching data for ${event}`);
//       const response = await axios.get(eventUrls[event]);
//       const data = response.data;

//       subscribers[event].forEach((socket) => {
//         socket.emit(event, data);
//         console.log(`Emitted ${event} to socket: ${socket.id}`);
//       });
//     } catch (err) {
//       console.error(`Error fetching ${event}:`, err.message);
//     }
//   }, intervalTime);
// };

// // === Start polling all events ===
// startPolling('topGainers', 30000);
// startPolling('topLosers', 30000);
// startPolling('hotCurrencies', 30000);

// // === On client connection ===
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);


//   socket.on('topGainers', () => {
//     subscribers.topGainers.add(socket);
//     console.log(`Subscribed to topGainers: ${socket.id}`);
//   });

//   socket.on('topLosers', () => {
//     subscribers.topLosers.add(socket);
//     console.log(`Subscribed to topLosers: ${socket.id}`);
//   });

//   socket.on('hotCurrencies', () => {
//     subscribers.hotCurrencies.add(socket);
//     console.log(`Subscribed to hotCurrencies: ${socket.id}`);
//   });

//   // === On disconnect: cleanup ===
//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//     Object.keys(subscribers).forEach(event => {
//       subscribers[event].delete(socket);
//     });
//   });
// });

// server.listen(9090, () => {
//   console.log('Socket.io server is running on http://localhost:9090');
// });




const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const BitzUp_URL = 'http://localhost:1000/market-data';

const server = http.createServer();
const io = socketIo(server, {
    cors: {
        origin: "*",  // For testing, allows all origins
        methods: ["GET", "POST"],
        credentials: true
    },
    cookie: {
        sameSite: 'None',
        secure: true  // This should be set to true if you're using HTTPS
    }
});

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    let interval;

    const fetchData = async (url, event) => {
        try {
            console.log(`Fetching data from ${url}`);
            const response = await axios.get(url);
            const data = response.data;
            // console.log(`Fetched data: ${JSON.stringify(data)}`);
            socket.emit(event, data);  // Directly emit the data without stringifying it
            console.log(`Emitted event: ${event}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle marketFetchdata event
    socket.on('marketFetchdata', (message) => {
        if (interval) {
            clearInterval(interval);
        }
        let url = `${BitzUp_URL}/marketData`;
        let event = 'marketData';

        interval = setInterval(() => fetchData(url, event), 3000000);
        fetchData(url, event);
    });

    // Handle usdtmarket event
    socket.on('topGainers', (message) => {
        if (interval) {
            clearInterval(interval);
        }
        let url = `${BitzUp_URL}/topGainers`;
        let event = 'topGainers';

        interval = setInterval(() => fetchData(url, event), 3000000);
        fetchData(url, event);
    });

    // Handle coinFetchdata event
    socket.on('topLosers', (message) => {
        if (interval) {
            clearInterval(interval);
        }
      
        let url = `${BitzUp_URL}/topLosers`;
        let event = 'topLosers';

        interval = setInterval(() => fetchData(url, event), 30000);
        fetchData(url, event);
    });

    socket.on('hotCurrencies', (message) => {
        if (interval) {
            clearInterval(interval);
        }
      
        let url = `${BitzUp_URL}/hotCurrencies`;
        let event = 'hotCurrencies';

        interval = setInterval(() => fetchData(url, event), 30000);
        fetchData(url, event);
    });

    // Clear interval on disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (interval) {
            clearInterval(interval);
        }
    });
});

server.listen(9090, () => {
    console.log('Socket.io server is running on http://localhost:9090');
});
