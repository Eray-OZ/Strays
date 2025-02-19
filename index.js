import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import router from './router.js'
import { connectDB } from './db.js'
import { checkUser } from './middleware.js'



dotenv.config()

const port = process.env.PORT


const app = express()




app.set('view engine', 'ejs')

app.use(express.json())

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
)

app.get("*", checkUser)

app.use("/", router)





app.listen(port, () => {
    connectDB()
    console.log("Server runs on http://localhost:" + port)
})