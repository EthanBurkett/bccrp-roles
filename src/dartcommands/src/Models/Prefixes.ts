import mongoose from "mongoose";
import { Events } from "../../index";
import DartCommands from "../index";

const Name = "dartcommands-prefixes";

const schema = new mongoose.Schema({
  GuildID: {
    type: String,
    required: true,
  },
  Prefix: {
    type: String,
    required: true,
  },
});

export default mongoose.models[Name] || mongoose.model(Name, schema);
