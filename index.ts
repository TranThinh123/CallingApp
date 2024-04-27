import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import accountRouter from "./routes/Account"
import groupRouter from "./routes/Group"
import dmChatRouter from "./routes/DMChat"
import groupChatRouter from "./routes/GroupChat"
import imageRouter from "./routes/Image"
import { Server } from "socket.io"
import { getChatDMDataAndReturn } from "./controller/DMChat"
import { getChatGroupDataAndReturn } from "./controller/GroupChat"
const PORT = 3000
const CLUSTERNAME = "cluster0"
const PASSWORD = "6vVdndp9h5vXUwp1"
const DBNAME = "RealTimeChat"
//App set up
const app = express()
app.use(
    cors({
        origin: "https://siri-real-time-chat.netlify.app",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
)
app.use(express.static(__dirname + "/public"))
app.use(express.json())
var port = PORT || 3000
var server = app.listen(port, () => {
    console.log("Server is running")
})
const io = new Server(server, {
    cors: {
        origin: "https://siri-real-time-chat.netlify.app",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
})
io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`)
    socket.on("on-chat", async (data) => {
        if (data.type === "dm") {
            const result = await getChatDMDataAndReturn(data)
            io.emit("user-chat", result)
        } else {
            const result = await getChatGroupDataAndReturn(data)
            io.emit("user-chat", result)
        }
    })
    socket.on("disconnect", () => {
        console.log(`bye ${socket.id}`)
    })
})
//Set up mongoose
const uri = `mongodb+srv://sa:${PASSWORD}@${CLUSTERNAME}.yuh6by2.mongodb.net/${DBNAME}?retryWrites=true&w=majority`
mongoose.connect(uri)
//Router
app.get("/", (req, res) => {
    res.send("This is Sirikakire calling app server api side, this server is running very well. Hope you are having a wonderful day")
})
app.use("/api/Account", accountRouter)
app.use("/api/Group", groupRouter)
app.use("/api/DMChat", dmChatRouter)
app.use("/api/GroupChat", groupChatRouter)
app.use("/api/Image", imageRouter)



