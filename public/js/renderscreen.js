export default function renderScreen(pscreen, game, requestAnimationFrame, pplayerId, imageVector) {
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

    function drawPlayer(player) {
        const me = {
            x: new Date().getSeconds() % 2 == 0 ? 1220 : 2200,
            y: 420
        }
        
        const another = {
            x: 342,
            y: new Date().getSeconds() % 2 == 0 ? 1420 : 420
        }

        const playerToDraw = player.playerId == pplayerId ? me : another;

        cnvCtx.drawImage(imageVector, 
            playerToDraw.x, /* Início da Imagem eixo X*/ 
            playerToDraw.y, /* Início da Imagem eixo Y*/ 
            700, /* Largura Recorte - Eixo X */
            700, /* Altura Recorte- Eixo Y */
            player.x, /* Posição X */
            player.y, /* Posição Y */
            player.w, /* Largura Objeto */
            player.h  /* Altura do Objeto */
        );
    }

    function drawFruit(fruit) {
        
        /* Coordenadas do Morango */
        const strawberry = {
            x: 3042,
            y: 420
        }

        /* Coordenadas da Cereja */
        const cherry = {
            x: 3980,
            y: 420
        }

        const fruitToDraw = fruit.kind == 1 ? strawberry : cherry;

        cnvCtx.drawImage(imageVector, 
            fruitToDraw.x, /* Início da Imagem eixo X*/ 
            fruitToDraw.y, /* Início da Imagem eixo Y*/ 
            700, /* Largura Recorte - Eixo X */
            700, /* Altura Recorte- Eixo Y */
            fruit.x, /* Posição X */
            fruit.y, /* Posição Y */
            fruit.w, /*Largura Objeto */
            fruit.h /*Altura do Objeto */
        );
    }

    /*Iteração nos jogadores*/
    var playerScoreHeight = 25;    
    for (const playerId in game.state.players) {
        let player = game.state.players[playerId];
        cnvCtx.fillStyle = getPlayerColor(player.playerId);
        drawPlayer(player);
        printScoreElement(player);
    };

    /*Iteração nas frutas*/
    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        drawFruit(fruit);
    };    

    if (game.state.anyWinner){
        cnvCtx.fillStyle = "White"
        cnvCtx.font = "80px Roboto"
        cnvCtx.textAlign = "center";
        cnvCtx.fillText(game.state.winner.nickname + " Wins", pscreen.width/2, pscreen.height / 2);
    }

    requestAnimationFrame(() => {
        renderScreen(pscreen, game, requestAnimationFrame, pplayerId, imageVector)
    });     
}