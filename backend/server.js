const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectDb = require('./config/db')


dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

connectDb()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

