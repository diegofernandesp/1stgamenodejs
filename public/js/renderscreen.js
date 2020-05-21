export default function renderScreen(pscreen, game, requestAnimationFrame, pplayerId) {
    const fruitColor = "#d11141";
    const myPlayerColor = "#00b159";
    const AnotherPlayersColor = "#ffc425"
    
    var cnvCtx = pscreen.getContext("2d");
    cnvCtx.clearRect(0, 0, pscreen.width, pscreen.height);

    const getPlayerColor = function(playerId) {
        return pplayerId == playerId ? myPlayerColor : AnotherPlayersColor;
    }
    
    const printScoreElement = (player) => {                                    
        cnvCtx.fillStyle = getPlayerColor(player.playerId)
        cnvCtx.font = "25px Roboto";
        cnvCtx.textAlign = "right";
        cnvCtx.fillText(player.nickname + " ("+player.score+")", pscreen.width-30, playerScoreHeight += 50);
    };  

    /* Tentativa de ordenação por score */ 
    var playersList = game.state.players;
    playersList = Object.keys(playersList).sort( (a,b) => 
        playersList[a].score - playersList[b].score   
    );

    /*Iteração nos jogadores*/
    var playerScoreHeight = 50;    
    for (const playerId in game.state.players) {
        let player = game.state.players[playerId];
        cnvCtx.fillStyle = getPlayerColor(player.playerId);
        cnvCtx.fillRect(player.x, player.y, player.w, player.h);

        cnvCtx.fillStyle = "White"
        cnvCtx.font = "30px Comic Sans MS"
        cnvCtx.textAlign = "center";
        cnvCtx.fillText(player.score, player.x + Math.round(player.w/2), player.y + Math.round(player.h/2)+7);
        printScoreElement(player);
    };

    /*Iteração nas frutas*/
    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        cnvCtx.fillStyle = fruitColor;
        cnvCtx.fillRect(fruit.x, fruit.y, fruit.w, fruit.h);
    };    

    if (game.state.anyWinner){
        cnvCtx.fillStyle = "Black"
        cnvCtx.font = "80px Roboto"
        cnvCtx.textAlign = "center";
        cnvCtx.fillText(game.state.winner.nickname + " Wins", pscreen.width/2, pscreen.height / 2);
    }

    requestAnimationFrame(() => {
        renderScreen(pscreen, game, requestAnimationFrame, pplayerId)
    });     
}