import Dart from "./dartcommands/src";
import { Client, Intents } from "discord.js";
import Config from "./!config";
import mongoose from "mongoose";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE"],
});

mongoose.set("strictQuery", true);

client.on("ready", () => {
  new Dart(client, {
    prefix: "r!",
    typescript: true,
    testServers: ["702556315699904604"],
    commandsDir: "src/commands",
    mongo: {
      uri: Config.MONGO,
    },
    eventsDir: "src/events",
  }).defaultPrefix("r!");
});

client.login(Config.TOKEN);
