"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("RoleRequest", schema);
//# sourceMappingURL=requests.model.js.map