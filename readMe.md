./bin/zookeeper-server-start.sh ./config/zookeeper.properties

./bin/kafka-server-start.sh ./config/server.properties
11:42
./bin/windows/kafka-topics.bat --create --topic execution-report --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
11:42
./bin/windows/kafka-topics.bat --create --topic execution-report-update --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

./bin/windows/kafka-topics.bat --list --bootstrap-server localhost:9092

{
  "e": "executionReport",        // Event type
  "E": 1499405658658,            // Event time
  "s": "ETHBTC",                 // Symbol
  "c": "mUvoqJxFIILMdfAW5iGSOW", // Client order ID
  "S": "BUY",                    // Side
  "o": "LIMIT",                  // Order type
  "f": "GTC",                    // Time in force
  "q": "1.00000000",             // Order quantity
  "p": "0.10264410",             // Order price
  "P": "0.00000000",             // Stop price
  "F": "0.00000000",             // Iceberg quantity
  "g": -1,                       // OrderListId
  "C": "",                       // Original client order ID; This is the ID of the order being canceled
  "x": "NEW",                    // Current execution type
  "X": "NEW",                    // Current order status
  "r": "NONE",                   // Order reject reason; Please see Order Reject Reason (below) for more information.
  "i": 4293153,                  // Order ID
  "l": "0.00000000",             // Last executed quantity
  "z": "0.00000000",             // Cumulative filled quantity
  "L": "0.00000000",             // Last executed price
  "n": "0",                      // Commission amount
  "N": null,                     // Commission asset
  "T": 1499405658657,            // Transaction time
  "t": -1,                       // Trade ID
  "v": 3,                        // Prevented Match Id; This is only visible if the order expired due to STP
  "I": 8641984,                  // Execution Id
  "w": true,                     // Is the order on the book?
  "m": false,                    // Is this trade the maker side?
  "M": false,                    // Ignore
  "O": 1499405658657,            // Order creation time
  "Z": "0.00000000",             // Cumulative quote asset transacted quantity
  "Y": "0.00000000",             // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  "Q": "0.00000000",             // Quote Order Quantity
  "W": 1499405658657,            // Working Time; This is only visible if the order has been placed on the book.
  "V": "NONE"                    // SelfTradePreventionMode
}