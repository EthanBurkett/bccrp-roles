import { ICommand } from "../dartcommands";

import { MessageEmbed } from "discord.js";
import { inspect } from "util";
import { Embeds } from "../utils/embeds";

export default {
  description: "Runs javascript code",
  aliases: ["e", "js", "execute", "ce"],
  ownerOnly: true,
  category: "basic",
  hidden: true,

  async run({ message, args, client, guild, channel, member, instance }) {
    function clean(text: string) {
      if (typeof text === "string") {
        text = text
          .replace(/`/g, `\`${String.fromCharCode(8203)}`)
          .replace(/@/g, `@${String.fromCharCode(8203)}`)
          .replace(new RegExp(client?.token!, "gi"), "****");
      }
      return text;
    }
    if (!args![0]) return "gimme some code cunt";
    const { Embeds } = require("../utils/embeds");

    let input = args!.join(" ");
    input = input.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    let evaled;
    try {
      evaled = eval(input);
      if (evaled instanceof Promise) {
        evaled = await evaled;
      }
      if (
        clean(
          inspect(evaled, {
            depth: 0,
          })
        ) == undefined ||
        clean(
          inspect(evaled, {
            depth: 0,
          })
        ) == null
      )
        return;
      const embed = new MessageEmbed()
        .setTitle(`Code Execution`)
        .setColor(Embeds.MainColor)
        .addField(`:inbox_tray: Input`, `\`\`\`js\n${input}\n\`\`\``)
        .addField(
          `:outbox_tray: Output`,
          `\`\`\`js\n${clean(inspect(evaled, { depth: 0 }))}\n\`\`\``
        )
        .addField(`:rocket: Type`, `\`\`\`js\n${typeof evaled}\n\`\`\``);
      channel
        .send({
          embeds: [embed],
        })
        .catch((e: any) => {
          channel.send({
            embeds: [Embeds.ExecutionError(e)],
          });
        });
      return;
    } catch (err: any) {
      return {
        custom: true,
        embeds: [Embeds.ExecutionError(err)],
      };
    }
  },
} as ICommand;
