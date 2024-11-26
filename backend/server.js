const app = require('./app')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectDb = require('./config/db')
const socketIO = require('socket.io')
const http = require('http')


dotenv.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

connectDb()




const PORT = process.env.PORT || 5000;
let server = http.createServer(app)
let io = socketIO(server)

server.listen(PORT, ()=> {
    console.log(`server is on http://localhost:${PORT}`)
})

