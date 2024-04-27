"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Group_1 = require("../controller/Group");
const router = express_1.default.Router();
router.post("/getAllGroup", Group_1.getAllGroup);
router.post("/createGroup", Group_1.createGroup);
router.put("/joinGroup", Group_1.joinGroup);
router.put("/leaveGroup", Group_1.leaveGroup);
exports.default = router;
