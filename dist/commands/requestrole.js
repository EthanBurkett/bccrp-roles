"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const requests_model_1 = __importDefault(require("../models/requests.model"));
const rradmin_model_1 = __importDefault(require("../models/rradmin.model"));
exports.default = {
    slash: true,
    description: "Returns pong!",
    options: [
        {
            name: "role",
            description: "Role to request",
            type: "ROLE",
            required: true,
        },
    ],
    testOnly: true,
    async run({ guild, member, interaction }) {
        if (!guild)
            return;
        const role = interaction.options.getRole("role", true).id;
        const exists = await requests_model_1.default.findOne({
            _id: guild.id,
            userId: member.id,
        });
        if (exists)
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: "Error",
                        color: "RED",
                        description: "You already have a role request waiting to be approved. Please wait until it is approved or denied.",
                    }),
                ],
            });
        const res = await rradmin_model_1.default.findOne({ _id: guild.id });
        if (!res)
            return {
                ephemeral: true,
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: "Error",
                        color: "RED",
                        description: "The server admins have not configured the request role system.",
                    }),
                ],
            };
        const channel = await guild.channels.cache.get(res.channelId);
        if (channel && channel.type !== "GUILD_TEXT")
            return {
                ephemeral: true,
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: "Error",
                        color: "RED",
                        description: "The server admins have not configured the request role system properly.",
                    }),
                ],
            };
        if (!channel)
            return {
                ephemeral: true,
                embeds: [
                    new discord_js_1.MessageEmbed({
                        title: "Error",
                        color: "RED",
                        description: "The server admins have not configured the request role system properly.",
                    }),
                ],
            };
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("accept")
            .setLabel("Accept")
            .setStyle("SUCCESS"), new discord_js_1.MessageButton()
            .setCustomId("deny")
            .setLabel("Deny")
            .setStyle("DANGER"));
        const newMsg = await channel.send({
            components: [row],
            embeds: [
                new discord_js_1.MessageEmbed({
                    title: "Role Request",
                    color: "BLUE",
                    description: `${member} (${member.id}) has requested the role ${interaction.options.getRole("role", true)}.`,
                }),
            ],
        });
        await requests_model_1.default.create({
            _id: guild.id,
            userId: member.id,
            messageId: newMsg.id,
            roleId: role,
        });
        interaction === null || interaction === void 0 ? void 0 : interaction.reply({
            ephemeral: true,
            embeds: [
                new discord_js_1.MessageEmbed({
                    title: "Success",
                    color: "GREEN",
                    description: "Your request has been sent to the server admins.",
                }),
            ],
        });
    },
};
//# sourceMappingURL=requestrole.js.map