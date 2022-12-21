import { MessageEmbed } from "discord.js";
import { ICommand } from "../../dartcommands";
import rradminModel from "../models/rradmin.model";

export default {
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
    if (!guild) return;

    const res = await rradminModel.findOne({ _id: guild.id });
    if (!res) {
      await rradminModel
        .create({
          _id: guild.id,
          channelId: interaction!.options.getChannel("channel", true).id,
        })
        .catch((e) => {
          console.log(e);
          channel.send({
            embeds: [
              new MessageEmbed({
                title: "Error",
                color: "RED",
                description: "An error occurred while writing to the database.",
              }),
            ],
          });
        });
    } else {
      await rradminModel
        .findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            channelId: interaction!.options.getChannel("channel", true).id,
          }
        )
        .catch((e) => {
          console.log(e);
          channel.send({
            embeds: [
              new MessageEmbed({
                title: "Error",
                color: "RED",
                description: "An error occurred while writing to the database.",
              }),
            ],
          });
        });
    }

    return new MessageEmbed({
      title: "Success",
      color: "GREEN",
      description: "The channel has been set successfully.",
    });
  },
} as ICommand;
