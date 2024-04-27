import Account from "../model/Account"
import Group from "../model/Group"
import EmailService from "../service/EmailService"
import mongoose from "mongoose"
export const getAllAccount = async (req: any, res: any) => {
    Account.find(
        {
            _id: { $ne: req.body._id },
        },
        (err: any, results: any) => {
            res.json(results)
        }
    )
}
export const getEveryAccount = async (req: any, res: any) => {
    Account.find((err: any, results: any) => {
        res.json(results)
    })
}
export const createAnAccount = async (req: any, res: any) => {
    const newAccount = new Account({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
        group: [],
    })
    Account.create(newAccount, (err, account) => {
        res.json(newAccount)
    })
}
export const getAccount = async (req: any, res: any) => {
    Account.findOne(
        {
            email: req.body.email,
            password: req.body.password,
        },
        (err: any, account: any) => {
            res.json(account)
        }
    )
}
export const getAccountWithId = async (req: any, res: any) => {
    Account.findOne(
        {
            _id: req.params.Id,
        },
        (err: any, account: any) => {
            res.json(account)
        }
    )
}
export const forgotPassword = async (req: any, res: any) => {
    const account = await Account.findOne({ email: req.body.email })
    if (account !== null) {
        res.json(null)
        const randomString = Math.random().toString(36).slice(-8)
        await Account.findOneAndUpdate(
            { email: req.body.email },
            { password: randomString }
        )
        const bodyText = `Someone (hopefully you) has requested a password reset for your SiriBlogger account. Your new password: ${randomString}
    If you don't wish to reset your password, disregard this email and no action will be taken. SiriBlogger!! <3`
        EmailService({
            to: req.body.email,
            text: bodyText,
            from: "SiriBlogger",
            subject: "Generate new password for your email",
        })
    } else {
        res.json({ message: "Account does not exist" })
    }
}
export const updateNewPassword = async (req: any, res: any) => {
    const account = await Account.findOneAndUpdate(
        {
            _id: req.body._id,
        },
        {
            password: req.body.password,
        },
        {
            new: true,
        }
    )
    if (account === null || account.password !== req.body.password)
        res.json({
            message: "Cannot update new password",
        })
    else res.json(null)
}
