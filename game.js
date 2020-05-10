var canvas = document.getElementById("canvas");
var cnvCtx = canvas.getContext("2d");

var scoreCanvas = document.getElementById("score");
var scoreCtx = scoreCanvas.getContext("2d");
scoreCtx.font = "15px consolas";

function createGame() {
    const state = {
        fruits: {},
        players: {}
    };

    function addPlayer(command){
        state.players[command.playerId] = {
            playerId: command.playerId,
            x: command.x,
            y: command.y,
            w: command.w,
            h: command.h,
            score: command.score
        }
    }

    function removePlayer(command){
        delete state.players[command.playerId]
    }

    var handleMovement = {
        ArrowUp: function (e) {
            if (e.y > 0)
                e.y -= 1;
        },
        ArrowDown: function (e) {
            if (e.y < canvas.height - 1)
                e.y += 1;
        },
        ArrowLeft: function (e) {
            if (e.x > 0)
                e.x -= 1;
        },
        ArrowRight: function (e) {
            if (e.x < canvas.width - 1)
                e.x += 1;
        },
        n: function () {
            game.state.fruits = {};
        }
    };    

    function movePlayer(command) {
        console.log("moving " + command.playerId + " with " + command.keyPressed);
        const moveFunction = handleMovement[command.keyPressed];
        const player = state.players[command.playerId];
        if (moveFunction){
            moveFunction(player)
            detectColision(command.playerId);
        }
        
    };

    function detectColision(playerId) {
        for (fruitId in state.fruits) {
            fruit = state.fruits[fruitId]
            player = state.players[playerId]
            if (player.x == fruit.x && player.y == fruit.y) {
                console.log("Houve colisão entre um jogador e uma fruta - Um jogador comeu uma fruta");
                delete state.fruits[fruitId];
                player.score += 1;
            }
        }
    }

    function addRandomFruit() {
        /* Gera uma string aleatória para ser usada como propriedade para o objeto frutas */
        var newFruitName = function () {
            var length = 30;
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
    
        var newFruit = {
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10),
            w: 1,
            h: 1
        };
    
        game.state.fruits[newFruitName()] = newFruit;
    };

    /*função que define de quanto em quanto tempo as frutas vão ser geradas na tela*/
    setInterval(function () {
        addRandomFruit()
    }, 3245);

    return {
        movePlayer,
        state,
        addPlayer,
        removePlayer
    }
}

const game = createGame(); 
const keyDownListener = createKeyDownListener();
keyDownListener.subscribe(game.movePlayer);

function createKeyDownListener(){
    const state = {
        observers: []
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction);
    }

    function notifyAll(command){
        console.log("notifying "+state.observers.length+" observers");
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    window.addEventListener("keydown", keyDownHandler);

    function keyDownHandler(e) {
        var keyPressed = e.key;
    
        const command = {
            playerId: "player1",
            keyPressed
        }
    
        notifyAll(command);
    }

    return{
        subscribe
    }
}

renderScreen();

function renderScreen() {
    cnvCtx.clearRect(0, 0, canvas.width, canvas.height);
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

    /*Iteração nos jogadores*/
    y = 30
    for (playerId in game.state.players) {
        player = game.state.players[playerId];
        cnvCtx.fillStyle = "#1a0500";
        cnvCtx.fillRect(player.x, player.y, player.w, player.h);
        scoreCtx.fillText(player.playerId + " = " + player.score, 1, y);
        y += 18;
    };

    /*Iteração nas frutas*/
    for (fruitId in game.state.fruits) {
        fruit = game.state.fruits[fruitId];
        cnvCtx.fillStyle = "#ff3300";
        cnvCtx.fillRect(fruit.x, fruit.y, fruit.w, fruit.h);
    };
    requestAnimationFrame(renderScreen);
}