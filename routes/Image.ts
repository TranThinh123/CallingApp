import express from 'express'
import getImage from '../controller/Image'
const router = express.Router()


router.get("/:Id", getImage)

export default router