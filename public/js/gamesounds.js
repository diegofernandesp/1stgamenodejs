export default function gameSounds(){
    var backgroundAudio = new Audio("../audio/background2.mp3")
    var coinSoundAudio = new Audio("../audio/smw_coin.wav")
    var eatFruitAudio = new Audio("../audio/smw_1-up.wav")
    var PlayerInAudio = new Audio("../audio/smw_egg_hatching.wav")
    var PlayerOutAudio = new Audio("../audio/smw_lemmy_wendy_falls_out_of_pipe.wav")
    var movePlayerAudio = new Audio("../audio/smw_jump.wav");
    var bubblePopAudio = new Audio("../audio/smw_bubble_pop.wav");
    var courseClearAudio = new Audio("../audio/smw_course_clear.wav");
    var gameOverAudio = new Audio("../audio/smw_game_over.wav");
    var kickAudio = new Audio("../audio/smw_kick.wav");

    function background(){
        backgroundAudio.play()
    }
    
    function coinSound() {
        coinSoundAudio.play()
    }

    function eatFruit() {
        eatFruitAudio.play()
    }
    
    function PlayerIn() {
        PlayerInAudio.play()
    }
    
    function PlayerOut() {
        PlayerOutAudio.play()
    }

    function movePlayer() {
        movePlayerAudio.play()
    }
    
    function bubblePop() {
        bubblePopAudio.play()
    }
    
    function courseClear() {
        courseClearAudio.play()
    }
    
    function gameOver() {
        gameOverAudio.play()
    }
    
    function kick() {
        kickAudio.play()
    }

    return {
        background,
        coinSound,
        eatFruit,
        PlayerIn,
        PlayerOut,
        movePlayer,
        bubblePop,
        courseClear,
        gameOver,
        kick
    }
}