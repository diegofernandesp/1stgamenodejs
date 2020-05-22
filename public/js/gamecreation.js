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
        maxPoints: 20,
        fruitsInterval: 1200,
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
            nickname: command.nickname
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
        },
        s: function () {
            console.log(state);
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
            state.winner = player
            notifyAll({
                type: "got-winner",
                player: player
            });
        }
    }

    function detectColision(playerId) {
        let player = state.players[playerId]
        var xp = [];
        var yp = [];
        for (var i = player.x; i <= player.x + player.w; i++)
            xp.push(i)
        for (var j = player.y; j <= player.y + player.h; j++)
            yp.push(j)
            
        for (const fruitId in state.fruits) {
            let fruit = state.fruits[fruitId]
            var xf = [];
            var yf = [];
            for (var i = fruit.x; i <= fruit.x + fruit.w; i++)
                xf.push(i)
            for (var j = fruit.y; j <= fruit.y + fruit.h; j++)
                yf.push(j)
            
            if ((xp.filter(value => xf.includes(value)).length > 0) 
            &&  (yp.filter(value => yf.includes(value)).length > 0)) {
                collisionActions(fruit, player);
            }
        }
    }
    
    function collisionActions(fruit, player) {
        removeFruit({
            fruitId : fruit.fruitId
        });
        increaseScore(player);                                
        if (state.anyWinner) {
            for (const pfruitId in state.fruits){
                removeFruit({fruitId: state.fruits[pfruitId].fruitId})
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
            kind: Math.round(Math.random()*1),
            x: command ? command.x : Math.floor(Math.random() * state.screen.width),
            y: command ? command.y : Math.floor(Math.random() * state.screen.height),
            w: state.objects.width,
            h: state.objects.height,
        };
        state.fruits[fruitId] = newFruit;

        notifyAll({
            type: "add-fruit",
            king: newFruit.kind,
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