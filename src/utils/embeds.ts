import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import moment from "moment";
import { client } from "..";

export const Embeds = {
  MainColor: 0xe81c73,
  Error(title: string, EmbedData?: MessageEmbedOptions) {
    return new MessageEmbed({
      ...EmbedData,
    })
      .setColor(0xa84032)
      .setTitle("<:xMark:732633283069870170>   " + title);
  },
  Success(title: string, EmbedData?: MessageEmbedOptions) {
    return new MessageEmbed({
      ...EmbedData,
    })
      .setColor(0x32a848)
      .setTitle("<:checkMark:732633309276012595>   " + title);
  },
  Info(title: string, description: string, EmbedData?: MessageEmbedOptions) {
    return new MessageEmbed({
      footer: {
        text: `${client.user?.tag} • ${moment()
          .utcOffset("-0500")
          .format("MM/DD/YY")} • ${moment()
          .utcOffset("-0500 ")
          .format("h:MM A [CST]")}`,
        icon_url: client.user?.displayAvatarURL({
          dynamic: true,
        }),
      },
      ...EmbedData,
    })
      .setColor(0xe81c73)
      .setTitle(title)
      .setDescription(description);
  },
  ExecutionError: (text: string) => {
    return new MessageEmbed({
      description: "<:xMark:732633283069870170>   `" + text + "`",
      color: 0xf54242,
    });
  },
};
