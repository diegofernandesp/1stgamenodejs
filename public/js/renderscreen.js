export default function renderScreen(screen, score, game, requestAnimationFrame) {
    var cnvCtx = screen.getContext("2d");
    cnvCtx.clearRect(0, 0, screen.width, screen.height);
    var scoreCtx = score.getContext("2d");
    scoreCtx.clearRect(0, 0, score.width, score.height);
    scoreCtx.font = "15px consolas";

    /*Iteração nos jogadores*/
    var y = 30
    for (const playerId in game.state.players) {
        let player = game.state.players[playerId];
        cnvCtx.fillStyle = "#1a0500";
        cnvCtx.fillRect(player.x, player.y, player.w, player.h);
        scoreCtx.fillText(player.playerId + " = " + player.score, 1, y);
        y += 18;
    };

    /*Iteração nas frutas*/
    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        cnvCtx.fillStyle = "#ff3300";
        cnvCtx.fillRect(fruit.x, fruit.y, fruit.w, fruit.h);
    };
    requestAnimationFrame(() => {
        renderScreen(screen, score, game, requestAnimationFrame)
    });
}