export default function createKeyDownListener(){
    const state = {
        observers: [],
        playerId: null
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction);
    }

    function unsubscribeAll(){
        state.observers = [];
    }

    function notifyAll(command){
        for (const observerFunction of state.observers){
            observerFunction(command);
        }
    }

    function registerPlayerId(playerId){
        state.playerId = playerId;
    }

    window.addEventListener("keydown", keyDownHandler);

    function keyDownHandler(e) {
        var keyPressed = e.key;
    
        const command = {
            type: "move-player",
            playerId: state.playerId,
            keyPressed
        }
    
        notifyAll(command);
    }

    return{
        subscribe,
        registerPlayerId,
        unsubscribeAll
    }
}