"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rradmin_model_1 = __importDefault(require("../models/rradmin.model"));
exports.default = {
    slash: true,
    description: "Configure rules for request role",
    testOnly: true,
    options: [
        {
            name: "channel",
            description: "Channel to send the roles requested",
            type: "CHANNEL",
            required: true,
        },
    ],
    permission: "ADMINISTRATOR",
    async run({ guild, channel, interaction }) {
        if (!guild)
            return;
        const res = await rradmin_model_1.default.findOne({ _id: guild.id });
        if (!res) {
            await rradmin_model_1.default
                .create({
                _id: guild.id,
                channelId: interaction.options.getChannel("channel", true).id,
            })
                .catch((e) => {
                console.log(e);
                channel.send({
                    embeds: [
                        new discord_js_1.MessageEmbed({
                            title: "Error",
                            color: "RED",
                            description: "An error occurred while writing to the database.",
                        }),
                    ],
                });
            });
        }
        else {
            await rradmin_model_1.default
                .findOneAndUpdate({
                _id: guild.id,
            }, {
                channelId: interaction.options.getChannel("channel", true).id,
            })
                .catch((e) => {
                console.log(e);
                channel.send({
                    embeds: [
                        new discord_js_1.MessageEmbed({
                            title: "Error",
                            color: "RED",
                            description: "An error occurred while writing to the database.",
                        }),
                    ],
                });
            });
        }
        return new discord_js_1.MessageEmbed({
            title: "Success",
            color: "GREEN",
            description: "The channel has been set successfully.",
        });
    },
};
//# sourceMappingURL=rradmin.js.map