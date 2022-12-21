import { Schema, model } from "mongoose";

export interface RoleRequest {
  _id: string;
  guildId: string;
  roleId: string;
  messageId: string;
}

const schema = new Schema<RoleRequest>({
  _id: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  roleId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
});

export default model<RoleRequest>("RoleRequest", schema);
