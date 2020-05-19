export default function renderScreen(pscreen, game, requestAnimationFrame, pplayerId) {
    const fruitColor = "#d11141";
    const myPlayerColor = "#00b159";
    const AnotherPlayersColor = "#ffc425"
    
    var cnvCtx = pscreen.getContext("2d");
    cnvCtx.clearRect(0, 0, pscreen.width, pscreen.height);

    const getPlayerColor = function(playerId) {
        return pplayerId == playerId ? myPlayerColor : AnotherPlayersColor;
    }
    
    const printScoreElement = (player, list) => {                                    

        var item = document.createElement("li");
        item.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center");        
        list.appendChild(item);

        var playerName = document.createElement("small");
        playerName.setAttribute("style", "color: "+getPlayerColor(player.playerId));
        playerName.appendChild(document.createTextNode(player.playerId));
        item.appendChild(playerName);
        
        var score = document.createElement("span");
        score.setAttribute("class", "badge badge-primary badge-pill");
        score.appendChild(document.createTextNode(player.score));
        item.append(score);
    };  

    //const list = document.getElementById("game-score");
    //while (list.firstChild) {
    //    list.removeChild(list.firstChild);
    //}

    /* Tentativa de ordenação por score */ 
    var playersList = game.state.players;
    playersList = Object.keys(playersList).sort( (a,b) => 
        playersList[a].score - playersList[b].score   
    );

    /*Iteração nos jogadores*/
    playersList.forEach(playerIdx => {
        let player = game.state.players[playerIdx];
        cnvCtx.fillStyle = getPlayerColor(player.playerId);
        cnvCtx.fillRect(player.x, player.y, player.w, player.h);

        cnvCtx.fillStyle = "White"
        cnvCtx.font = "30px Comic Sans MS"
        cnvCtx.textAlign = "center";
        cnvCtx.fillText(player.score, player.x + Math.round(player.w/2), player.y + Math.round(player.h/2));
        //printScoreElement(player, list);
    });

    /*Iteração nas frutas*/
    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        cnvCtx.fillStyle = fruitColor;
        cnvCtx.fillRect(fruit.x, fruit.y, fruit.w, fruit.h);
    };    

    

    requestAnimationFrame(() => {
        renderScreen(pscreen, game, requestAnimationFrame, pplayerId)
    });     
}