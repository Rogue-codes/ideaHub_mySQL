import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import adminRoute from './routes/admin/index.js'
import hubRoute from './routes/hubRoute/index.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(cookieParser())

const PORT = process.env.PORT

app.get('/', (req,res)=>{
    res.status(200).send('idea hub')
})

app.use(`/api/v1/ideahub`, adminRoute)
app.use(`/api/v1/ideahub`, hubRoute)

app.listen(PORT,()=>{
    console.log(`app listening on port ${PORT}`)
})