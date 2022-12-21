"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("./dartcommands/src"));
const discord_js_1 = require("discord.js");
const _config_1 = __importDefault(require("./!config"));
const mongoose_1 = __importDefault(require("mongoose"));
const client = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    partials: ["MESSAGE"],
});
mongoose_1.default.set("strictQuery", true);
client.on("ready", () => {
    new src_1.default(client, {
        prefix: "r!",
        typescript: true,
        testServers: ["702556315699904604"],
        commandsDir: "src/commands",
        mongo: {
            uri: _config_1.default.MONGO,
        },
        eventsDir: "src/events",
    }).defaultPrefix("r!");
});
client.login(_config_1.default.TOKEN);
//# sourceMappingURL=index.js.map