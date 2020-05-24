export default function createGame() {
    const screenBase = {
        x: 1920,
        y: 1080
    };

    const state = {
        fruits: {},
        players: {},
        screen: {
            width: screenBase.x,
            height: screenBase.y
        },
        objects: {
            width: Math.round(screenBase.x/32),
            height: Math.round(screenBase.y/18)
        },
        maxPoints: 100,
        fruitsInterval: 500,
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
            score: command.score,
            nickname: command.nickname,
            lastMovement: "ArrowRight"
        }

        notifyAll({
            type: 'add-player',
            playerId: command.playerId,
            x: command.x,
            y: command.y,
            w: state.objects.width,
            h: state.objects.height,
            score: command.score,
            nickname: command.nickname
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
            e.lastMovement = "ArrowUp";
            if (e.y > 0)
                e.y -= state.objects.height;
        },
        ArrowDown: function (e) {            
            e.lastMovement = "ArrowDown";
            if (e.y < state.screen.height - state.objects.height)
                e.y += state.objects.height;
        },
        ArrowLeft: function (e) {
            e.lastMovement = "ArrowLeft";
            if (e.x > 0)
                e.x -= state.objects.width;
        },
        ArrowRight: function (e) {
            e.lastMovement = "ArrowRight";
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
        },
        s: function () {
            console.log(state);
            console.log(Object.entries(state.fruits).length);
        }

    };        

    function movePlayer(command) {
        const moveFunction = handleMovement[command.keyPressed];
        const player = state.players[command.playerId];        
        notifyAll(command);
        if (moveFunction){
            moveFunction(player)
            detectColision(command.playerId);
        }        
    };
    
    function increaseScore(player) {
        player.score++;
        if (player.score === state.maxPoints) {        
            state.anyWinner = true
            state.winner = player
            state.fruits = {}
            notifyAll({
                type: "got-winner",
                player: player
            });
        }
    }

    function detectColision(playerId) {
        let player = state.players[playerId]
        for (const fruitId in state.fruits) {
            let fruit = state.fruits[fruitId]
            if (!fruit) break
            if (fruit.x == player.x && fruit.y == player.y){
                collisionActions(fruit, player);                            
            }
        }
    }
    
    function collisionActions(fruit, player) {
        removeFruit({
            fruitId : fruit.fruitId,
            player: player
        });
        increaseScore(player);                                                        
    }
    
    function removeFruit(command){        
        delete state.fruits[command.fruitId];      
        notifyAll({
            type: 'remove-fruit',
            fruitId: command.fruitId,
            player: command.player
        })
    }
    
    function addFruit(command) {
        if (Object.entries(state.players).length === 0) return
        
        if (state.anyWinner) {            
            return
        }
                
        const generateFruitData = function(fruitData){
            const dummyX = Math.random() * state.screen.width;
            const randomX = dummyX - (dummyX % state.objects.width);
            
            const dummyY = Math.random() * state.screen.height;
            const randomY = dummyY - (dummyY % state.objects.height);

            const newFruitId = Math.floor(Math.random() * 9999999999999);
            const kind = Math.round(Math.random()*6);

            for (var fruitId in state.fruits){
                const fruit = state.fruits[fruitId]
                if ((randomX == fruit.x && randomY == fruit.y) ||
                    (fruit.fruitId == newFruitId)){
                    return false;
                }
            }
            
            fruitData.x = randomX;
            fruitData.y = randomY;
            fruitData.fruitId = newFruitId;
            fruitData.kind = kind;

            return true;
        }
        
        if (!command){
            var fruitData = {}
            if (!generateFruitData(fruitData)) {
                return
            }
        }
        
        var newFruit = {
            fruitId: command ? command.fruitId : fruitData.fruitId,
            kind: command ? command.kind : fruitData.kind,
            x: command ? command.x : fruitData.x,
            y: command ? command.y : fruitData.y,
            w: state.objects.width,
            h: state.objects.height,
        };
        state.fruits[newFruit.fruitId] = newFruit;

        notifyAll({
            type: "add-fruit",
            kind: newFruit.kind,
            fruitId: newFruit.fruitId,
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