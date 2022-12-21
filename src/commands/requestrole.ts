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
    {
      name: "user",
      description: "User to request the role for",
      type: "USER",
      required: false,
    },
  ],
  testOnly: true,
  async run({ guild, member, interaction }) {
    if (!guild) return;
    const role = interaction!.options.getRole("role", true).id;
    const user = interaction!.options.getUser("user", false);
    const target = user ? guild.members.cache.get(user.id)! : member;

    const exists = await requestsModel.findOne({
      _id: target.id,
      guildId: guild.id,
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
      content: "@here",
      embeds: [
        Embeds.Info(
          `Role Assignment Request`,
          `**Role:** <@&${role}>\n**Recipient:** ${target}\n**Requested by:** ${member}`
        ),
      ],
    });

    await requestsModel.create({
      _id: target.id,
      guildId: guild.id,
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
