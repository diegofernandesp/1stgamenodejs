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
    const nickname = socket.handshake.query.nickname

    console.log('Player connected: ' + playerId + ' ' + nickname)        

    game.addPlayer({playerId: playerId, x: 0, y: 0, score: 0, nickname: nickname})

    console.log(Object.entries(game.state.players).length + ' players connected')

    socket.emit('setup', game.state)
    
    socket.on('disconnect', () => {
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

const port = 3000;
server.listen(port, () => {
    console.log("Server Listening on port " + port)
})