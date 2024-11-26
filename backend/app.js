const express = require('express')
const http = require('http')
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');


const app = express()

// const server = http.createServer(app)

const { Server } = require('socket.io')

const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('user Connected: ', socket.id)

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id)
    })
})

// configuration of env file
if(process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({path: './.env'})
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

const user = require('./routes/userRoutes');
const chat = require('./routes/chatRotes')
const chatSocket = require('./socket/chatSocket');


app.use('/api/user', user)
app.use('/api/chat', chat)

// chatSocket(server)


module.exports =app;