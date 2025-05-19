const { Spot, WebsocketStream } = require("@binance/connector");
const { Kafka } = require('kafkajs');
const {accounts} = require('../config/config')
require("dotenv").config();

// const apiKey ='TjnvJCOXHB54SjgvrOSqRaFK2rTUApJGfM30UPOFbsAZprFRtSDLf203phlHej8g';
// const apiSecret ='AkkfmZtrszpLQttGwes4r5mX03M79Da6TYr0vYgyoL13K0LxF0n4dMCDi33SN7yz';
const connectBinanceAccounts = async (account) => {
const client = new Spot(account.apiKey, account.apiSecret, {
  baseURL: account.binance_url,
  timeout: 5000,
});

// Kafka client and producer setup
const kafka = new Kafka({
  clientId: 'binance-producer',
  brokers: ['localhost:9092'], // Adjust your Kafka broker address
});

const producer = kafka.producer();

// Connect the Kafka producer/
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
        console.log(`Sending execution report to Kafka: ${JSON.stringify(data)}`);
        await sendExecutionReportToKafka('execution-report', data);
    }
  },
  Error: (error) => console.error('titu error',error),
};

const connectExecutionReport = async (account) => {
  try {
    const websocketStreamClient = new WebsocketStream({
      callbacks,
      wsURL: account.binance_ws_url,
    });


    const updateListenKey = async () => {
      try {
        const ListenKey = await client.createListenKey();
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

connectExecutionReport(account);
}

function main(accounts) {
  for (const account of accounts) {
    connectBinanceAccounts(account);
  }
};

main(accounts);