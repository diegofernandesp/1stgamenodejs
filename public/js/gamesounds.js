export default function gameSounds(){

    function background(){
        var audio = new Audio("../audio/background2.mp3")
        audio.play()
    }
    
    function coinSound() {
        var audio = new Audio("../audio/smw_coin.wav")
        audio.play()
    }

    function eatFruit() {
        var audio = new Audio("../audio/smw_1-up.wav")
        audio.play()
    }
    
    function PlayerIn() {
        var audio = new Audio("../audio/smw_egg_hatching.wav")
        audio.play()
    }
    
    function PlayerOut() {
        var audio = new Audio("../audio/smw_lemmy_wendy_falls_out_of_pipe.wav")
        audio.play()
    }

    function movePlayer() {
        var audio = new Audio("../audio/smw_jump.wav");
        audio.play()
    }
    
    function bubblePop() {
        var audio = new Audio("../audio/smw_bubble_pop.wav");
        audio.play()
    }
    
    function courseClear() {
        var audio = new Audio("../audio/smw_course_clear.wav");
        audio.play()
    }
    
    function gameOver() {
        var audio = new Audio("../audio/smw_game_over.wav");
        audio.play()
    }
    
    function kick() {
        var audio = new Audio("../audio/smw_kick.wav");
        audio.play()
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