import { ICommand } from "../../dartcommands";

export default {
  slash: true,
  description: "Returns pong!",
  testOnly: true,
  run({ guild }) {
    if (!guild) return;
    return "Pong!";
  },
} as ICommand;
