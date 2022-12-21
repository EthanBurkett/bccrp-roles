import { Schema, model } from "mongoose";

export interface RoleRequest {
  _id: string;
  channelId: string;
}

const schema = new Schema<RoleRequest>({
  _id: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
});

export default model<RoleRequest>("RoleRequestSettings", schema);
