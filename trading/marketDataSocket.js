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

        interval = setInterval(() => fetchData(url, event), 500000);
        fetchData(url, event);
    });

    // Handle usdtmarket event
    socket.on('topGainers', (message) => {
        if (interval) {
            clearInterval(interval);
        }
        let url = `${BitzUp_URL}/topGainers`;
        let event = 'topGainers';

        interval = setInterval(() => fetchData(url, event), 50000);
        fetchData(url, event);
    });

    // Handle coinFetchdata event
    socket.on('topLosers', (message) => {
        if (interval) {
            clearInterval(interval);
        }
      
        let url = `${BitzUp_URL}/topLosers`;
        let event = 'topLosers';

        interval = setInterval(() => fetchData(url, event), 50000);
        fetchData(url, event);
    });

    socket.on('hotCurrencies', (message) => {
        if (interval) {
            clearInterval(interval);
        }
      
        let url = `${BitzUp_URL}/hotCurrencies`;
        let event = 'hotCurrencies';

        interval = setInterval(() => fetchData(url, event), 50000);
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
