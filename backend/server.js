import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// 🔥 NEW IMPORTS (for serving images)
import path from 'path'
import { fileURLToPath } from 'url'

// app config
const app = express()
const port = process.env.PORT || 4000

// connect database & cloudinary
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// 🔥 SERVE UPLOADS FOLDER (VERY IMPORTANT)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 👉 This makes: http://localhost:4000/uploads/image.jpg work
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// test route
app.get('/', (req, res) => {
    res.send('API WORKING')
})

// start server
app.listen(port, () => console.log("Server Started", port))