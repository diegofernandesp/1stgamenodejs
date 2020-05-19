export default function createGame() {
    const screenBase = 2000;

    const state = {
        fruits: {},
        players: {},
        screen: {
            width: screenBase,
            height: screenBase
        },
        objects: {
            width: Math.round(screenBase*0.04),
            height: Math.round(screenBase*0.04)
        },
        maxPoints: 100,
        fruitsInterval: 50,
        anyWinner: false
    };

    const observers = [];

    function start(){
        const frequency = state.fruitsInterval;
        setInterval(addFruit, frequency);
    }

    function subscribe(observerFunction){
        observers.push(observerFunction);
    }

    function notifyAll(command){
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
            w: state.objects.width,
            h: state.objects.height,
            score: command.score
        }

        notifyAll({
            type: 'add-player',
            playerId: command.playerId,
            x: command.x,
            y: command.y,
            w: state.objects.width,
            h: state.objects.height,
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
                e.y -= state.objects.height;
        },
        ArrowDown: function (e) {
            if (e.y < state.screen.height - state.objects.height)
                e.y += state.objects.height;
        },
        ArrowLeft: function (e) {
            if (e.x > 0)
                e.x -= state.objects.width;
        },
        ArrowRight: function (e) {
            if (e.x < state.screen.width - state.objects.width)
                e.x += state.objects.width;
        },
        n: function (e) {
            state.fruits = {};
            state.anyWinner = false;
            for (const playerId in state.players) {
                const player = state.players[playerId];
                player.score = 0;
            }
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
    
    function increaseScore(player) {
        player.score++;
        if (player.score === state.maxPoints) {        
            state.anyWinner = true
            notifyAll({
                type: "got-winner",
                player: player
            });
        }
    }

    function detectColision(playerId) {
        for (const fruitId in state.fruits) {
            let fruit = state.fruits[fruitId]
            let player = state.players[playerId]
            // if (player.x == fruit.x && player.y == fruit.y) {
            if (((fruit.x >= player.x && fruit.x <= player.x + player.w) &&
                 (fruit.y >= player.y && fruit.y <= player.y + player.h)) || 
                ((player.x >= fruit.x && player.x <= fruit.x + fruit.w) &&
                 (player.y >= fruit.y && player.y <= fruit.y + fruit.h)))  
            {
                increaseScore(player);                        
                removeFruit({
                    fruitId : fruit.fruitId
                });
                if (state.anyWinner) {
                    for (const pfruitId in state.fruits){
                        removeFruit({fruitId: state.fruits[pfruitId].fruitId})
                    }
                }
            }
        }
    }
    
    function removeFruit(command){        
        delete state.fruits[command.fruitId];      
        notifyAll({
            type: 'remove-fruit',
            fruitId: command.fruitId
        })
    }

    function addFruit(command) {
        if (Object.entries(state.players).length === 0) return
        if (state.anyWinner) {            
            return
        }

        const fruitId = Math.floor(Math.random() * 9999999999999);
    
        var newFruit = {
            fruitId: fruitId,
            x: command ? command.x : Math.floor(Math.random() * state.screen.width),
            y: command ? command.y : Math.floor(Math.random() * state.screen.height),
            w: state.objects.width,
            h: state.objects.height,
        };
        state.fruits[fruitId] = newFruit;

        notifyAll({
            type: "add-fruit",
            fruitId: fruitId,
            x: newFruit.x,
            y: newFruit.y,
            w: newFruit.w,
            h: newFruit.h,
        });
    };

    return {
        movePlayer,
        state,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        setState,
        subscribe,
        start
    }
}