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
exports.updateNewPassword = exports.forgotPassword = exports.getAccountWithId = exports.getAccount = exports.createAnAccount = exports.getEveryAccount = exports.getAllAccount = void 0;
const Account_1 = __importDefault(require("../model/Account"));
const EmailService_1 = __importDefault(require("../service/EmailService"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Account_1.default.find({
        _id: { $ne: req.body._id },
    }, (err, results) => {
        res.json(results);
    });
});
exports.getAllAccount = getAllAccount;
const getEveryAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Account_1.default.find((err, results) => {
        res.json(results);
    });
});
exports.getEveryAccount = getEveryAccount;
const createAnAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccount = new Account_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
        group: [],
    });
    Account_1.default.create(newAccount, (err, account) => {
        res.json(newAccount);
    });
});
exports.createAnAccount = createAnAccount;
const getAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Account_1.default.findOne({
        email: req.body.email,
        password: req.body.password,
    }, (err, account) => {
        res.json(account);
    });
});
exports.getAccount = getAccount;
const getAccountWithId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Account_1.default.findOne({
        _id: req.params.Id,
    }, (err, account) => {
        res.json(account);
    });
});
exports.getAccountWithId = getAccountWithId;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_1.default.findOne({ email: req.body.email });
    if (account !== null) {
        res.json(null);
        const randomString = Math.random().toString(36).slice(-8);
        yield Account_1.default.findOneAndUpdate({ email: req.body.email }, { password: randomString });
        const bodyText = `Someone (hopefully you) has requested a password reset for your SiriBlogger account. Your new password: ${randomString}
    If you don't wish to reset your password, disregard this email and no action will be taken. SiriBlogger!! <3`;
        (0, EmailService_1.default)({
            to: req.body.email,
            text: bodyText,
            from: "SiriBlogger",
            subject: "Generate new password for your email",
        });
    }
    else {
        res.json({ message: "Account does not exist" });
    }
});
exports.forgotPassword = forgotPassword;
const updateNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_1.default.findOneAndUpdate({
        _id: req.body._id,
    }, {
        password: req.body.password,
    }, {
        new: true,
    });
    if (account === null || account.password !== req.body.password)
        res.json({
            message: "Cannot update new password",
        });
    else
        res.json(null);
});
exports.updateNewPassword = updateNewPassword;
