export default function createGame() {
    const state = {
        fruits: {},
        players: {},
        screen: {
            width: 10,
            height: 10
        }
    };

    const observers = [];

    function start(){
        const frequency = 2622;
        setInterval(addFruit, frequency);
    }

    function subscribe(observerFunction){
        observers.push(observerFunction);
    }

    function notifyAll(command){
        console.log("notifying "+observers.length+" observers");
        for (const observerFunction of observers){
            observerFunction(command);
        }
    }

    function setState(newState){
        Object.assign(state, newState);
    }

    function addPlayer(command){
        state.players[command.playerId] = {
            playerId: command.playerId,
            x: command.x,
            y: command.y,
            w: command.w,
            h: command.h,
            score: command.score
        }

        notifyAll({
            type: 'add-player',
            playerId: command.playerId,
            x: command.x,
            y: command.y,
            w: command.w,
            h: command.h,
            score: command.score
        })
    }

    function removePlayer(command){
        delete state.players[command.playerId];

        notifyAll({
            type: 'remove-player',
            playerId: command.playerId
        });
    }

    var handleMovement = {
        ArrowUp: function (e) {
            if (e.y > 0)
                e.y -= 1;
        },
        ArrowDown: function (e) {
            if (e.y < state.screen.height - 1)
                e.y += 1;
        },
        ArrowLeft: function (e) {
            if (e.x > 0)
                e.x -= 1;
        },
        ArrowRight: function (e) {
            if (e.x < state.screen.width - 1)
                e.x += 1;
        },
        n: function () {
            game.state.fruits = {};
        }
    };    

    function movePlayer(command) {
        notifyAll(command);
        const moveFunction = handleMovement[command.keyPressed];
        const player = state.players[command.playerId];
        if (moveFunction){
            moveFunction(player)
            detectColision(command.playerId);
        }
        
    };

    function detectColision(playerId) {
        for (const fruitId in state.fruits) {
            let fruit = state.fruits[fruitId]
            let player = state.players[playerId]
            if (player.x == fruit.x && player.y == fruit.y) {
                console.log("Houve colisão entre um jogador e uma fruta - Um jogador comeu uma fruta");
                delete state.fruits[fruitId];
                player.score += 1;
            }
        }
    }

    function addFruit(command) {
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

        const fruitId = newFruitName();
    
        var newFruit = {
            fruitId: fruitId,
            x: command ? command.x : Math.floor(Math.random() * 10),
            y: command ? command.y : Math.floor(Math.random() * 10),
            w: 1,
            h: 1
        };
        state.fruits[fruitId] = newFruit;

        notifyAll({
            type: "add-fruit",
            fruitId: fruitId,
            x: newFruit.x,
            y: newFruit.y
        })
    };

    return {
        movePlayer,
        state,
        addPlayer,
        addFruit,
        removePlayer,
        setState,
        subscribe,
        start
    }
}