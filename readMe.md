./bin/zookeeper-server-start.sh ./config/zookeeper.properties

./bin/kafka-server-start.sh ./config/server.properties
11:42
./bin/windows/kafka-topics.bat --create --topic execution-report --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
11:42
./bin/windows/kafka-topics.bat --create --topic execution-report-update --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

./bin/windows/kafka-topics.bat --list --bootstrap-server localhost:9092