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
exports.leaveGroup = exports.joinGroup = exports.createGroup = exports.getAllGroup = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Group_1 = __importDefault(require("../model/Group"));
const Account_1 = __importDefault(require("../model/Account"));
const GroupChat_1 = __importDefault(require("../model/GroupChat"));
const fs_1 = __importDefault(require("fs"));
const getAllGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_1.default.findOne({
        _id: req.body.from_id
    });
    if (account != null) {
        Group_1.default.find({
            _id: {
                $in: account.group
            }
        }, (err, results) => {
            if (!err) {
                res.json(results);
            }
            else {
                console.log(err);
            }
        });
    }
});
exports.getAllGroup = getAllGroup;
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Tạo nhóm mới
    const group = new Group_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: req.body.groupName
    });
    Group_1.default.create(group);
    //Tìm kiếm account và thêm group mới tạo vào account
    const account = yield Account_1.default.findOne({
        _id: req.body._id
    });
    if (account === null) {
        res.json(null);
    }
    else {
        let groupObject = {
            _id: group._id
        };
        let groupArray = [...account.group, groupObject];
        yield Account_1.default.findOneAndUpdate({
            _id: account._id
        }, {
            group: groupArray
        });
        //Thực hiện mời các thành viên vào group mới tạo
        for (var i = 0; i < req.body.groupAccounts.length; i++) {
            Account_1.default.findOne({
                email: req.body.groupAccounts[i]
            }, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err) {
                    let groupInvite = [...result.group, groupObject];
                    yield Account_1.default.findOneAndUpdate({
                        _id: result._id
                    }, {
                        group: groupInvite
                    });
                }
            }));
        }
        res.json(group);
    }
});
exports.createGroup = createGroup;
const joinGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let account = yield Account_1.default.findOne({
        _id: req.body._id
    });
    if (account !== null) {
        let group = yield Group_1.default.findOne({
            _id: req.body.group_id
        });
        if (group === null) {
            res.json(null);
        }
        else {
            let newGroupArray = [...account.group, {
                    _id: req.body.group_id
                }];
            yield Account_1.default.findOneAndUpdate({
                _id: account._id
            }, {
                group: newGroupArray
            });
            res.json(group);
        }
    }
    else
        res.json(null);
});
exports.joinGroup = joinGroup;
const leaveGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //Tìm kiếm tài khoản cần rời nhóm
    let account = yield Account_1.default.findOne({
        _id: req.body._id
    });
    if (account !== null) {
        //Tìm kiếm và truy xuất nhóm cần rời
        let newGroupArray = account.group;
        for (var i = 0; i < newGroupArray.length; i++) {
            if (req.body.group_id === ((_a = newGroupArray[i]._id) === null || _a === void 0 ? void 0 : _a.toString())) {
                newGroupArray.splice(newGroupArray.indexOf(newGroupArray[i]), 1);
                break;
            }
        }
        //Cập nhật lại tài khoản mới
        yield Account_1.default.findOneAndUpdate({
            _id: account._id
        }, {
            group: newGroupArray
        });
        //Tìm kiếm nhóm vừa bị xoá khỏi tài khoản
        let group = yield Group_1.default.findOne({
            _id: req.body.group_id
        });
        //Kiểm tra thử là có còn ai tồn đọng trong nhóm
        if (checkAnyAccountLeftInTheGroup(yield Account_1.default.find({}), group === null || group === void 0 ? void 0 : group._id) === false) {
            //Xoá ảnh thuộc về nhóm
            let groupChat = yield GroupChat_1.default.find({
                to_id: group === null || group === void 0 ? void 0 : group._id,
                chatCategory: "1"
            });
            let path = __dirname.replace("/controller", "");
            for (let i = 0; i < groupChat.length; i++) {
                if (fs_1.default.existsSync(`${path}/public/images/${groupChat[i].content}`)) {
                    fs_1.default.unlink(`${path}/public/images/${groupChat[i].content}`, err => {
                        if (err)
                            console.log(err);
                        console.log(`Successfully deleted ${groupChat[i].content}`);
                    });
                }
            }
            //Xoá hết tất cả đoạn chat đến group này
            yield GroupChat_1.default.deleteMany({
                to_id: group === null || group === void 0 ? void 0 : group._id
            });
            //Xoá nhóm
            yield Group_1.default.findOneAndDelete({
                _id: group === null || group === void 0 ? void 0 : group._id
            });
        }
        else {
            //Chuyển đổi người dùng thành -> Thành viên đã bị xoá khỏi nhóm
            let groupChat = yield GroupChat_1.default.find({
                from_id: account._id,
                to_id: group === null || group === void 0 ? void 0 : group._id,
                chatCategory: "1"
            });
            //Xoá ảnh của những người đã rời khỏi nhóm
            let path = __dirname.replace("/controller", "");
            for (let i = 0; i < groupChat.length; i++) {
                if (fs_1.default.existsSync(`${path}/public/images/${groupChat[i].content}`)) {
                    fs_1.default.unlink(`${path}/public/images/${groupChat[i].content}`, err => {
                        if (err)
                            console.log(err);
                        console.log(`Successfully deleted ${groupChat[i].content}`);
                    });
                }
            }
            yield GroupChat_1.default.updateMany({
                from_id: account._id,
                to_id: group === null || group === void 0 ? void 0 : group._id
            }, {
                content: "The message was deleted!!"
            });
        }
        res.json(group);
    }
    else {
        res.json(null);
    }
});
exports.leaveGroup = leaveGroup;
const checkAnyAccountLeftInTheGroup = (allAccount, group_id) => {
    for (var i = 0; i < allAccount.length; i++) {
        for (var k = 0; k < allAccount[i].group.length; k++) {
            if (allAccount[i].group[k]._id.toString() === group_id.toString()) {
                return true;
            }
        }
    }
    return false;
};
