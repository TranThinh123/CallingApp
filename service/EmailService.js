"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "thaiduynguyen.nt@gmail.com",
        pass: "camhaltjdaaqnjao", // your password
    },
});
const EmailService = (emailAddress) => {
    transport.sendMail(emailAddress, (error, info) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(info);
        }
    });
};
exports.default = EmailService;
