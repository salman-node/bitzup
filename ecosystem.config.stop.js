module.exports = {
    apps: [
      {
        name: "zookeeper",
        script: "./zookeeper-server-stop.sh",
        args: "../config/zookeeper.properties",
        cwd: "/root/kafka_2.13-3.9.0/bin",
        autorestart: true,
      },
      {
        name: "kafka",
        script: "./kafka-server-stop.sh",
        args: "../config/server.properties",
        cwd: "/root/kafka_2.13-3.9.0/bin",
        autorestart: true,
      }
    ]
  };
  