import express from "express"
import mongoose, { MongooseOptions } from "mongoose"
import DMChat from "../model/DMChat"
import fs from "fs"
import Account from "../model/Account"
export const addAChat = async (req: express.Request, res: express.Response) => {
    const newChat = new DMChat({
        _id: new mongoose.Types.ObjectId(),
        chatDate: new Date(),
        content: req.body.content,
        from_id: req.body.from_id,
        to_id: req.body.to_id,
    })
    DMChat.create(newChat, (err, result) => {
        res.json(newChat)
    })
}
export const getChat = async (req: express.Request, res: express.Response) => {
    const result1 = await DMChat.find({
        from_id: req.body.user1_id,
        to_id: req.body.user2_id,
    }).populate("from_id")
    const result2 = await DMChat.find({
        from_id: req.body.user2_id,
        to_id: req.body.user1_id,
    }).populate("from_id")
    const result3 = [...result1, ...result2]
    result3.sort((a: any, b: any) => {
        return a.chatDate > b.chatDate ? 1 : -1
    })
    res.json(result3)
}
export const getChatDMDataAndReturn = async (data: any) => {
    const result = await DMChat.create({
        _id: new mongoose.Types.ObjectId(),
        chatDate: data.chatDate,
        content: data.content,
        from_id: data.from_id,
        to_id: data.to_id,
        chatCategory: data.chatCategory,
    })
    return await DMChat.findOne({
        _id: result._id,
    }).populate("from_id")
}
export const loadImage = (req: express.Request, res: express.Response) => {
    res.json({ name: req.file?.filename })
}
