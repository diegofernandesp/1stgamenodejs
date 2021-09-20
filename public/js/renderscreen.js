export default function renderScreen(pscreen, game, requestAnimationFrame, pplayerId, imageVector) {
    const myPlayerColor = "#ffc425";
    const AnotherPlayersColor = "#7b7b7b"
    
    var cnvCtx = pscreen.getContext("2d");
    cnvCtx.clearRect(0, 0, pscreen.width, pscreen.height);

    const getPlayerColor = function(playerId) {
        return pplayerId == playerId ? myPlayerColor : AnotherPlayersColor;
    }
    
    const printScoreElement = (player) => {                                    
        cnvCtx.fillStyle = getPlayerColor(player.playerId)
        cnvCtx.font = "25px Roboto";
        cnvCtx.textAlign = "right";
        cnvCtx.fillText(player.nickname + " ("+player.score+")", pscreen.width-30, playerScoreHeight += 30);
    };  

    /* Tentativa de ordenação por score */ 
    var playersList = []
    for (var playerId in game.state.players){
        const player = game.state.players[playerId]
        playersList.push([player.nickname, player.score])
    }
    playersList.sort(function(a, b) {
        return a[1] - b[1];
    });

    function drawPlayer(player) {

        const spriteMovIdx = new Date().getSeconds();

        var movements = {
            ArrowRight: [0,50,100],
            ArrowDown: [150,200,250],
            ArrowLeft: [300,350,400],
            ArrowUp: [450,500,550]
        }

        const me = {
            x: 850,
            y: movements[player.lastMovement][spriteMovIdx % 3]
        }
        
        const another = {
            x: 900,
            y: movements[player.lastMovement][spriteMovIdx % 3]
        }

        const playerToDraw = player.playerId == pplayerId ? me : another;

        cnvCtx.drawImage(imageVector, 
            playerToDraw.x, /* Início da Imagem eixo X*/ 
            playerToDraw.y, /* Início da Imagem eixo Y*/ 
            44, /* Largura Recorte - Eixo X */
            44, /* Altura Recorte- Eixo Y */
            player.x, /* Posição X */
            player.y, /* Posição Y */
            player.w, /* Largura Objeto */
            player.h  /* Altura do Objeto */
        );
    }

    function drawFruit(fruit) {
        
        /* Coordenadas da Fruta */
        const fruitToDraw = {
            x: fruit.kind > 6 ? 4 : 604,
            y: fruit.kind > 6 ? 12*50 : fruit.kind * 50 + 4
        }

        cnvCtx.drawImage(imageVector, 
            fruitToDraw.x, /* Início da Imagem eixo X*/ 
            fruitToDraw.y, /* Início da Imagem eixo Y*/ 
            44, /* Largura Recorte - Eixo X */
            44, /* Altura Recorte- Eixo Y */
            fruit.x, /* Posição X */
            fruit.y, /* Posição Y */
            fruit.w, /*Largura Objeto */
            fruit.h /*Altura do Objeto */
        );
    }

    /*Iteração nas frutas*/
    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        drawFruit(fruit);
    };
        
    /*Iteração nos jogadores*/
    var playerScoreHeight = 15;    
    for (const playerId in game.state.players) {
        let player = game.state.players[playerId];
        cnvCtx.fillStyle = getPlayerColor(player.playerId);
        drawPlayer(player);
        printScoreElement(player);
    };

    if (game.state.anyWinner){
        cnvCtx.fillStyle = "White"
        cnvCtx.font = "80px Roboto"
        cnvCtx.textAlign = "center";
        cnvCtx.fillText(game.state.winner.nickname + " Wins", pscreen.width/2, pscreen.height/2);
    }

    requestAnimationFrame(() => {
        renderScreen(pscreen, game, requestAnimationFrame, pplayerId, imageVector)
    });     
}