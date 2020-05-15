import express from 'express'
import http from 'http'
import createGame from './public/js/gamecreation.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

const game = createGame()
game.subscribe((command) =>{
    sockets.emit(command.type, command)
})

game.start()

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log('Player connected: ' + playerId);

    game.addPlayer({playerId: playerId, w: 1, h: 1, x: 0, y: 0, score: 0})

    socket.emit('setup', game.state)
    
    socket.on('disconnect', () =>{
        game.removePlayer({playerId: playerId})
        console.log('Player ' + playerId + ' disconnected');
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})


app.use(express.static('public'))

server.listen(3000, () => {
    console.log("Server Listening on port 3000")
})