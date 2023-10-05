const mqtt = require("mqtt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Cycle = require("./models/cycleModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const mqttConnectWithCycleDB = () => {
  const options = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
  };

  const client = mqtt.connect(options);

  client.on("connect", () => {
    client.subscribe("esp/humidity");
    // client.subscribe('XOXO');
    console.log("MQTT client has subscribed");
  });
  let flag = false;
  client.on("message", async (topic, message) => {
    message = message.toString().split(",");
    message[1] = +message[1];
    message[2] = +message[2];
    if (flag === true) return;
    flag = true;
    const updateLocation = {
      $set: {
        "location.coordinates": [message[1], message[2]],
      },
    };

    await Cycle.updateOne({ name: `TempCycle-${message[0]}` }, updateLocation);
    console.log(message);
  });

  setInterval(() => {
    flag = false; // Reset the flag to false
  }, process.env.MQTT_UPDATE_INTERVAL);
};

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
    mqttConnectWithCycleDB();
  });
