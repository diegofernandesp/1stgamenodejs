export default function createKeyDownListener(){
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