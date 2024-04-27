"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImage = exports.getChatGroupDataAndReturn = exports.getChat = exports.addAChat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GroupChat_1 = __importDefault(require("../model/GroupChat"));
const addAChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newChat = new GroupChat_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        chatDate: new Date(),
        content: req.body.content,
        from_id: req.body.from_id,
        to_id: req.body.to_id
    });
    GroupChat_1.default.create(newChat, (err, result) => {
        res.json(newChat);
    });
});
exports.addAChat = addAChat;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result1 = yield GroupChat_1.default.find({
        to_id: req.body.user2_id
    }).populate('from_id');
    result1.sort((a, b) => {
        return a.chatDate > b.chatDate ? 1 : -1;
    });
    res.json(result1);
});
exports.getChat = getChat;
const getChatGroupDataAndReturn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield GroupChat_1.default.create({
        _id: new mongoose_1.default.Types.ObjectId(),
        chatDate: data.chatDate,
        content: data.content,
        from_id: data.from_id,
        to_id: data.to_id,
        chatCategory: data.chatCategory,
    });
    return yield GroupChat_1.default.findOne({
        _id: result._id
    }).populate('from_id');
});
exports.getChatGroupDataAndReturn = getChatGroupDataAndReturn;
const loadImage = (req, res) => {
    res.json({ name: req.file.filename });
};
exports.loadImage = loadImage;
