import { Schema, model } from "mongoose";

export interface RoleRequest {
  _id: string;
  userId: string;
  roleId: string;
  messageId: string;
}

const schema = new Schema<RoleRequest>({
  _id: {
    type: String,
    required: true,
  },
  userId: {
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
