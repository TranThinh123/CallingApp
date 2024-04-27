"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DMChatSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    chatDate: {
        type: Date
    },
    content: {
        type: String
    },
    from_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account'
    },
    to_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account'
    },
    chatCategory: {
        type: String
    }
}, {
    collection: 'DMChat'
});
const DMChat = mongoose_1.default.model('DMChat', DMChatSchema);
exports.default = DMChat;
