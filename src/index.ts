import Dart from "../dartcommands/src";
import { Client, Intents } from "discord.js";
import Config from "./!config";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  new Dart(client, {
    prefix: "r!",
    typescript: true,
    testServers: ["702556315699904604"],
    commandsDir: "src/commands",
  });
});

client.login(Config.TOKEN);
