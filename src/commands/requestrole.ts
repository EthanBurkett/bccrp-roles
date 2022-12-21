import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Embeds } from "../utils/embeds";
import { ICommand } from "../dartcommands";
import requestsModel from "../models/requests.model";
import rradminModel from "../models/rradmin.model";

export default {
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
    if (!guild) return;
    const role = interaction!.options.getRole("role", true).id;

    const exists = await requestsModel.findOne({
      _id: guild.id,
      userId: member!.id,
    });

    if (exists)
      return interaction!.reply({
        ephemeral: true,
        embeds: [
          Embeds.Error(
            "You already have a role request waiting to be approved. Please wait until it is approved or denied."
          ),
        ],
      });

    const res = await rradminModel.findOne({ _id: guild.id });
    if (!res)
      return {
        ephemeral: true,
        embeds: [
          Embeds.Error(
            "The server admins have not configured the request role system."
          ),
        ],
      };

    const channel = await guild.channels.cache.get(res.channelId);
    if (channel && channel.type !== "GUILD_TEXT")
      return {
        ephemeral: true,
        embeds: [
          Embeds.Error(
            "The server admins have not configured the request role system properly."
          ),
        ],
      };

    if (!channel)
      return {
        ephemeral: true,
        embeds: [
          Embeds.Error(
            "The server admins have not configured the request role system properly."
          ),
        ],
      };

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("deny")
        .setLabel("Deny")
        .setStyle("DANGER")
    );

    const newMsg = await channel.send({
      components: [row],
      embeds: [
        Embeds.Info(
          `Success`,
          `${member!} (${
            member!.id
          }) has requested the role ${interaction!.options.getRole(
            "role",
            true
          )}.`
        ),
      ],
    });

    await requestsModel.create({
      _id: guild.id,
      userId: member!.id,
      messageId: newMsg.id,
      roleId: role,
    });

    interaction?.reply({
      ephemeral: true,
      embeds: [
        Embeds.Success("Your request has been sent to the server admins."),
      ],
    });
  },
} as ICommand;
