const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
    }
})

io.on('connection', (socket)=> {
    const socketUser = socket.id
    console.log(`${socketUser} connected`)

    
    

    socket.on('disconnect', () => {
        console.log(`${socketUser} disconnected`)
    })
})

server.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))