"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("RoleRequestSettings", schema);
//# sourceMappingURL=rradmin.model.js.map