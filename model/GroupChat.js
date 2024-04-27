"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GroupChatSchema = new mongoose_1.default.Schema({
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
        ref: 'Group'
    },
    chatCategory: {
        type: String
    }
}, {
    collection: 'GroupChat'
});
const GroupChat = mongoose_1.default.model('GroupChat', GroupChatSchema);
exports.default = GroupChat;
