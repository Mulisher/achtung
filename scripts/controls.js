let controls = [[false,false],
                [false,false],
                [false,false],
                [false,false],
                [false,false],
                [false,false] ]

function keyPressed(){
    keyLockout = true
    if(key === ' '){
        switch (state){
            case 'menu':
                if(!controlsChanging)newGame()
                break;
            case 'game':
                pause = !pause
                break;
            case 'round':
                if(checkGameEnd()){
                    state = 'game_over'
                }else{
                    newRound()
                }
                break;
            case 'game_over':
                backToMenu()
        }
    }
    if(key === 'Escape'){
        switch (state){
            case 'game':
                backToMenu()
                break;
        }
    }
    for(let i = 0; i < 6; i++){
        if(key === playerKeys[i][0])controls[i][0] = true
        if(key === playerKeys[i][1])controls[i][1] = true
    }
}

function keyReleased(){
    keyLockout = false
    for(let i = 0; i < 6; i++){
        if(key === playerKeys[i][0])controls[i][0] = false
        if(key === playerKeys[i][1])controls[i][1] = false
    }
}
