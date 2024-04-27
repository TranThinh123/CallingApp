"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getImage = (req, res) => {
    let path = __dirname.replace("/controller", "");
    res.sendFile(`${path}/public/images/${req.params.Id}`);
};
exports.default = getImage;
