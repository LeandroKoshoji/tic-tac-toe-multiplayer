const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')
const {
    defaultBoard,
    addPlayerMove,
    addPlayerMoveInBoard,
    changeTurn,
    checkWinner,
    checkDraw
} = require('./game')

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://lka-tic-tac-toe.netlify.app",
    }
})

io.on('connection', (socket)=> {
    const socketUser = socket.id
    console.log(`${socketUser} connected`)

    const serverRooms = io.sockets.adapter.rooms
    
    // Check and Join Room
    socket.on('check_room', async (roomId, callback) => {
        const isRoom = serverRooms.get(roomId)
        const isRoomFull = isRoom?.size === 2

        if (isRoomFull) {
            return callback({
                status: 400,
                message: 'This session is already full.'
            })
        }
        await socket.join(roomId)
        const room = serverRooms.get(roomId)
        const firstToJoin = serverRooms.get(roomId).size === 1

        if (firstToJoin) {
            room.players = {
                X: {
                    symbol: 'X',
                    moves: [],
                    score: 0
                }
            }
            callback({ status: 200, player: room.players.X })
        } else {
            room.players = {
                ...room.players,
                O: {
                    symbol: 'O',
                    moves: [],
                    score: 0
                }
            }
            callback({ status: 200, player: room.players.O })
            io.to(roomId).emit('ready_to_start', room.players)
        }
        
    })

    
    socket.on('start_game', (roomId, callback) => {
        const room = serverRooms.get(roomId)
        const board = [...defaultBoard]
        const firstTurn = 'X'

        room.board = board
        room.turn = firstTurn
        room.ties = 0

        callback({
            start: true,
            board: room.board,
            turn: room.turn,
            gameScore: {
                X: 0,
                O: 0,
                ties: 0
            }
        })
    })

    socket.on('player_move', (playerMove, callback) => {
        const roomId = playerMove.roomId
        const room = serverRooms.get(roomId)
        const playerTurn = playerMove.turn
        const player = room.players[playerTurn]
        const moveIndex = playerMove.moveIndex
        const roomBoard = room.board
        const playerOneMoves = room.players.X.moves
        const playerTwoMoves = room.players.O.moves
        const isGameOver = room.gameOver
        if (isGameOver) return
        if (playerOneMoves.length + playerTwoMoves.length === roomBoard.length) return
            
        addPlayerMoveInBoard(roomBoard, playerTurn, moveIndex)
        addPlayerMove(player.moves, moveIndex)
        changeTurn(room, playerTurn)
        const winner = checkWinner(room, playerOneMoves, playerTwoMoves)
        checkDraw(room, playerOneMoves, playerTwoMoves, winner)

        if (winner) {
            io.to(roomId).emit('game_update', {
                board: room.board,
                turn: room.turn,
                winner: winner,
                winnerCombination: room.winnerCombination,
                gameOver: room.gameOver,
                scores: { X: room.players.X.score, ties: room.ties, O: room.players.O.score }
            })
        } else {
            io.to(roomId).emit('game_update', {
                board: room.board,
                turn: room.turn,
                winner: '',
                winnerCombination: [],
                gameOver: room.gameOver,
                playerUpdate: player,
                scores: { X: room.players.X.score, ties: room.ties, O: room.players.O.score }
            })
        }
    })

    socket.on('rematch', (roomId) => {
        const room = serverRooms.get(roomId)
        const board = [...defaultBoard]
        const firstTurn = 'X'

        room.board = board
        room.turn = firstTurn
        room.gameOver = false
        room.winner = ''
        room.winnerCombination = []
        room.players.X.moves = []
        room.players.O.moves = []

        io.to(roomId).emit('start_rematch_game', {
            board: room.board,
            turn: room.turn
        })
    })

    socket.on("ping", (callback) => {
        callback();
      });
    socket.on('disconnecting', () => {
        const ids = []
        socket.rooms.forEach(c => ids.push(c))
        const roomId = ids[1]

        io.to(roomId).emit('player_disconnected')
    })
    socket.on('disconnect', () => {
        console.log(`${socketUser} disconnected`)
    })
})

server.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))