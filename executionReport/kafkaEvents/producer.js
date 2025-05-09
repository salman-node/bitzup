const { Spot, WebsocketStream } = require("@binance/connector");
const { Kafka } = require('kafkajs');
const {config} = require('../config/config')
require("dotenv").config();

const apiKey = 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq';
const apiSecret = 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW';

const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 5000,
});

// Kafka client and producer setup
const kafka = new Kafka({
  clientId: 'binance-producer',
  brokers: ['localhost:9092'], // Adjust your Kafka broker address
});

const producer = kafka.producer();

// Connect the Kafka producer
const connectKafka = async () => {
  await producer.connect();
};

connectKafka();

// Function to send execution report to Kafka
const sendExecutionReportToKafka = async (topic, message) => {
  try {
    await producer.send({
      topic,
      key: JSON.stringify(message.c),   // used key as i (order id) to make sure all messages for the same order go to the same partition
      messages: [{ value: JSON.stringify(message)}],   // value is the execution report message
    });
    console.log(`Sent to Kafka topic: ${topic} :${JSON.stringify(message.i)} : ${JSON.stringify(message.t)}`);
  } catch (error) {
    console.error(`Error sending to Kafka topic ${topic}:`, error);
  }
};

const callbacks = {
  open: () => console.log("Connected with Binance WebSocket server"),
  close: () => console.log("Disconnected with Binance WebSocket server"),
  message: async (executionReport) => {
    const data = JSON.parse(executionReport);
   console.log(`Received message: ${JSON.stringify(data)}`);
    if (data.e === "executionReport") {
        // Send to Kafka
        await sendExecutionReportToKafka('execution-report', data);
    }
  },
};

const connectExecutionReport = async () => {
  try {
    const websocketStreamClient = new WebsocketStream({
      callbacks,
      wsURL: "wss://testnet.binance.vision",
    });

    const updateListenKey = async () => {
      try {
        const ListenKey = await client.createListenKey();
        console.log(ListenKey.data.listenKey);
        websocketStreamClient.userData(ListenKey.data.listenKey);
      } catch (error) {
        console.error(error);
      }
    };

    await updateListenKey();

    setInterval(updateListenKey, 5 * 60 * 1000); // update listen key every 20 minutes
  } catch (error) {
    console.error(error);
  }
};

connectExecutionReport();
