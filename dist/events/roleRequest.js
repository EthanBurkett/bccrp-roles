"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.config = void 0;
const discord_js_1 = require("discord.js");
const requests_model_1 = __importDefault(require("../models/requests.model"));
exports.config = {
    name: "interactionCreate",
};
const run = (client) => {
    client.on(exports.config.name, async (interaction) => {
        var _a;
        if (!interaction.isButton())
            return;
        const button = interaction;
        const db = await requests_model_1.default.findOne({
            _id: button.guild.id,
            messageId: button.message.id,
        });
        if (!button.guild || !db) {
            const Embed = [
                new discord_js_1.MessageEmbed({
                    title: "Error",
                    color: "RED",
                    description: `This request has expired or has already been approved/denied.`,
                }),
            ];
            return button.reply({
                embeds: Embed,
                ephemeral: true,
            });
        }
        const member = button.guild.members.cache.get(db.userId);
        const channel = button.channel;
        if (!member)
            return;
        if (button.customId === "accept") {
            let error = false;
            await member.roles
                .add(db.roleId)
                .catch(async () => {
                var _a;
                const Embed = [
                    new discord_js_1.MessageEmbed({
                        title: "Error",
                        color: "RED",
                        description: `This role is higher than my highest role. I cannot give <@&${db.roleId}> to **${member}**`,
                    }),
                ];
                (_a = button.channel) === null || _a === void 0 ? void 0 : _a.messages.fetch(db.messageId).then(async (msg) => {
                    await msg.delete().catch(() => { });
                });
                await requests_model_1.default.deleteOne({
                    _id: button.guild.id,
                    messageId: button.message.id,
                });
                error = true;
                return channel === null || channel === void 0 ? void 0 : channel.send({
                    embeds: Embed,
                });
            })
                .then(async () => {
                var _a;
                const Embed = [
                    new discord_js_1.MessageEmbed({
                        title: "Accepted",
                        color: "GREEN",
                        description: `${member} has been accepted for the role <@&${db.roleId}> by ${button.user}.`,
                    }),
                ];
                const msg = (_a = button.channel) === null || _a === void 0 ? void 0 : _a.messages.fetch(db.messageId).catch(() => {
                    return;
                });
                if (!msg || error)
                    return;
                msg.then(async (msg) => {
                    await msg.delete().catch((e) => {
                        console.log(e);
                    });
                });
                channel === null || channel === void 0 ? void 0 : channel.send({
                    embeds: Embed,
                });
                await requests_model_1.default.deleteOne({
                    _id: button.guild.id,
                    messageId: button.message.id,
                });
            });
        }
        else if (button.customId === "deny") {
            const Embed = [
                new discord_js_1.MessageEmbed({
                    title: "Denied",
                    color: "RED",
                    description: `${member} has been denied for the role <@&${db.roleId}> by ${button.user}.`,
                }),
            ];
            (_a = button.channel) === null || _a === void 0 ? void 0 : _a.messages.fetch(db.messageId).then(async (msg) => {
                await msg.delete().catch((e) => {
                    console.log(e);
                });
            });
            channel === null || channel === void 0 ? void 0 : channel.send({
                embeds: Embed,
            });
            await requests_model_1.default.deleteOne({
                _id: button.guild.id,
                messageId: button.message.id,
            });
        }
    });
};
exports.run = run;
//# sourceMappingURL=roleRequest.js.map