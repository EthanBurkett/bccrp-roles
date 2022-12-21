import {
  ButtonInteraction,
  CacheType,
  Client,
  Interaction,
  MessageEmbed,
} from "discord.js";
import { Embeds } from "../utils/embeds";
import requestsModel from "../models/requests.model";

export const config = {
  name: "interactionCreate",
};

export const run = (client: Client) => {
  client.on(config.name, async (interaction: Interaction<CacheType>) => {
    if (!interaction.isButton()) return;

    const button = interaction as ButtonInteraction;

    const db = await requestsModel.findOne({
      guildId: button.guild!.id,
      messageId: button.message.id,
    });
    if (!button.guild || !db) {
      const Embed = [
        new MessageEmbed({
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

    const member = button.guild.members.cache.get(db!._id);
    const channel = button.channel;
    let message = await button.channel?.messages.fetch(db!.messageId);
    if (message?.partial) message = await message.fetch();

    if (!member) return;

    if (button.customId === "accept") {
      let error = false;

      await member.roles
        .add(db.roleId)
        .catch(async () => {
          const Embed = [
            new MessageEmbed({
              title: "Error",
              color: "RED",
              description: `This role is higher than my highest role. I cannot give <@&${db.roleId}> to **${member}**`,
            }),
          ];

          error = true;

          return channel?.send({
            embeds: Embed,
          });
        })
        .then(async () => {
          const Embed = [
            new MessageEmbed({
              title: "Accepted",
              color: "GREEN",
              description: `${member} has been accepted for the role <@&${db.roleId}> by ${button.user}.`,
            }),
          ];

          const msg = button.channel?.messages.fetch(db.messageId).catch(() => {
            return;
          });
          if (!msg || error) return;

          msg!.then(async (msg) => {
            await msg!.delete().catch((e) => {
              console.log(e);
            });
          });

          channel?.send({
            embeds: Embed,
          });

          member
            .send({
              embeds: [
                Embeds.Success(
                  `Your role request for ${
                    button.guild?.roles.cache.get(db.roleId)?.name
                  } has been accepted.`
                ),
              ],
            })
            .catch(() => {});

          await requestsModel.deleteOne({
            guildId: button.guild!.id,
            messageId: button.message.id,
          });
        });
    } else if (button.customId === "deny") {
      const Embed = [
        new MessageEmbed({
          title: "Denied",
          color: "RED",
          description: `${member} has been denied for the role <@&${db.roleId}> by ${button.user}.`,
        }),
      ];

      button.channel?.messages.fetch(db.messageId).then(async (msg) => {
        await msg.delete().catch((e) => {
          console.log(e);
        });
      });

      channel?.send({
        embeds: Embed,
      });

      member
        .send({
          embeds: [
            Embeds.Error(
              `Your role request for ${
                button.guild?.roles.cache.get(db.roleId)?.name
              } has been denied.`
            ),
          ],
        })
        .catch(() => {});

      await requestsModel.deleteOne({
        guildId: button.guild.id,
        messageId: button.message.id,
      });
    }
  });
};
