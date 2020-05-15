export default function renderScreen(screen, game, requestAnimationFrame, pplayerId) {
    var cnvCtx = screen.getContext("2d");
    cnvCtx.clearRect(0, 0, screen.width, screen.height);

    const printScoreElement = (player, list) => {                                    

        var item = document.createElement("li");
        item.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center");
        item.appendChild(document.createTextNode(player.playerId));
        list.appendChild(item);
        
        var score = document.createElement("span");
        score.setAttribute("class", "badge badge-primary badge-pill")
        score.appendChild(document.createTextNode(player.score));
        item.append(score);
    };

    const list = document.getElementById("game-score");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    /*Iteração nos jogadores*/
    for (const playerId in game.state.players) {
        let player = game.state.players[playerId];
        cnvCtx.fillStyle = pplayerId == player.playerId ? "#FFAE33" : "#1a0500";
        cnvCtx.fillRect(player.x, player.y, player.w, player.h);
        printScoreElement(player, list);
    };

    /*Iteração nas frutas*/
    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        cnvCtx.fillStyle = "#ff3300";
        cnvCtx.fillRect(fruit.x, fruit.y, fruit.w, fruit.h);
    };
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, pplayerId)
    });     
}