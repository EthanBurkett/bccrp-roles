import { ICommand } from "../../dartcommands";

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
  run({ guild }) {
    if (!guild) return;
    return "Pong!";
  },
} as ICommand;
