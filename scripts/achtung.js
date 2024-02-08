const title = 'Achtung, die Kurve!'
const ver = 'ver 0.9 \"Refactorio\"'
let w,h
let fps = 30
let gameBorder
let borderThickness
let baseSpeed, baseSize
let holeSize
let players = []
let allTrails = []
let pickups = []
let gameWinner
let state = 'menu'
let pause = true;
let playerButtons = []
let menuButtons = []
let fgC,dFgC,bgC,lBgC,picBg,pColors,lColors
let controlsChanging = false
let controlsChangingN
let controlsChangingId
let scoreButtonPressed = false;
let keyLockout = false
let walls = true
let noPickupsYet
let goalScore = 20
const pickupsDelay = 30
const pickupLimit = 10
const pickupProb = 10
const pickupsEveryNthFrame = 15
const rotS = 0.125

let activePlayer = [true,true,false,false,false,false]

const playerNames = ['Red',
                     'Blue',
                     'Green',
                     'Yellow',
                     'Purple',
                     'Aqua']

let playerKeys = [ ['n','m'],
                   ['z','x'],
                   ['q','w'],
                   ['a','s'],
                   ['t','y'],
                   ['g','h'] ]


function setup(){
    w = Math.floor( windowWidth -5 )
    h = Math.floor( windowHeight -5 )
    gameBorder = Math.round(w*7/8)
    borderThickness = Math.round(w/200)
    createCanvas(w,h)
    frameRate(fps)
    noSmooth()
    textAlign(CENTER, CENTER)
    baseSpeed = Math.round(w/280)
    if(baseSpeed < 1)baseSpeed = 1
    baseSize = Math.round(w/350)
    if(baseSize < 4)baseSpeed = 4
    makeColors()
    makeMenu()
    console.log("Setup done")
}

function draw(){
    background(bgC)
    switch (state) {
        case 'menu':
            menu()
            break;
        case 'game':
            gameLoop()
            break;
        case 'round':
            roundEnd()
            break;
        case 'game_over':
            gameEnd()
            break;
    }
}

function backToMenu(){
    pause = true;
    players = []
    allTrails = []
    pickups = []
    state = 'menu'
}

function gameLoop(){
    for(let p of players){
        p.display()
        if(!pause && p.alive){
            p.update()
            p.checkCollision()
            newPickups()
        }
    }
    for(let i = pickups.length-1; i >= 0; i--){
        let pi = pickups[i]
        if(pi.toBeRemoved){
            pickups.splice(i,1)
        }else{
            pi.display()
            if(!pause){
                pi.update()
            }
        }
    }
    drawMap()
}

function newPickups(){
    if(noPickupsYet > 0){
        noPickupsYet--
        return
    }
    else if(frameCount % pickupsEveryNthFrame){
        return
    }
    else if(pickups.length < pickupLimit && random(100) < pickupProb){
        pickups.push(new Pickup(fps))
    }
}

function newGame(){
    if(countActive() < 1){
        state = 'menu'
        return
    }
    walls = true
    pause = true;
    players = []
    allTrails = []
    pickups = []
    noPickupsYet = pickupsDelay
    for(let i = 0; i < 6; i++){
        if(activePlayer[i] === true){
            const player = new Player(i)
            players.push(player)
        }
    }
    state = 'game'
}

function newRound(){
    walls = true
    allTrails = []
    pickups = []
    noPickupsYet = pickupsDelay
    for(let p of players){
        p.resetForStart()
    }
    pause = true;
    state = 'game'
}

function roundEnd(){
    let winner = -1
    for(let p of players){
        p.display()
        if(p.alive){
            winner = p.id
        }
    }
    for(let pi of pickups){
        pi.display()
    }
    stroke(bgC)
    if(winner === -1){
        fill(fgC)
        textSize(w/10)
        text('DRAW',gameBorder/2,height/2)
    }else{
        fill(pColors[winner])
        textSize(w/15)
        text(playerNames[winner] + ' wins!',gameBorder/2,height/2)
    }
    drawMap()
}

function gameEnd(){
    stroke(bgC)
    textSize(w/15)
    fill(pColors[gameWinner])
    text(playerNames[gameWinner]+' Wins!',width/2,height/8)
    textSize(w/20)
    const nx = w/2-w/18
    const sx = w/2+w/18
    for(let i = 0; i < players.length; i++){
        let p = players[i]
        fill(pColors[p.id])
        let ty = 2*h/7+(h/8)*i
        text(playerNames[p.id],nx,ty)
        text(p.score,sx,ty)
    }
}

function checkGameEnd(){
    if(players.length === 1)return false
    let scores = []
    for(let p of players){
        scores.push([p.score,p.id])
    }
    scores.sort(scoreSort)
    print(scores)
    if(scores[0][0] >= goalScore &&
        scores[0][0] > scores[1][0] + 1){
        gameWinner = scores[0][1]
        return true
    }
    return false
}

function scoreSort(a,b){
    if(a[0] === b[0]){
        return 0
    }
    else{
        return (a[0] > b[0]) ? -1 : 1
    }
}

function checkRoundWin(){
    if(countAlive() < 2){
        state = 'round'
        roundEnd()
    }
}

function countAlive(){
    let alive = 0
    for(let p of players){
        if(p.alive)alive++
    }
    return alive
}

function countActive(){
    let active = 0
    for(let i = 0; i < 6; i++){
        if(activePlayer[i])active++
    }
    return active
}

function drawMap(){
    noFill()
    const bT = borderThickness
    const bP = bT/2
    strokeWeight(bT)
    if(walls){ stroke(fgC ) }
    else     { stroke(dFgC) }
    rect(bP,bP,gameBorder-bP,h-bT)
    for(let i = 0; i < players.length; i++){
        const p = players[i]
        noStroke()
        fill(pColors[p.id])
        textSize(w/15)
        text(p.score,w*15/16,h/7+h/7*i)
    }
}

function makeColors(){
    bgC  = color(0x1d,0x20,0x21)
    lBgC = color(0x32,0x30,0x2f)
    fgC  = color(0xeb,0xdb,0xb2)
    dFgC = color(0xa8,0x99,0x84)
    picBg = color(0xd6,0x5d,0x0e)
    lColors = [color(0xfb,0x49,0x34),//red
        color(0x83,0xa5,0x98),//blue
        color(0xb8,0xbb,0x26),//green
        color(0xfa,0xbd,0x2f),//yellow
        color(0xd8,0x86,0x9b),//purple
        color(0x8e,0xc0,0x7c)]//aqua

    pColors = [color(0xcc,0x24,0x1d),//red
        color(0x45,0x85,0x88),//blue
        color(0x98,0x97,0x1a),//green
        color(0xd7,0x99,0x21),//yellow
        color(0xb1,0x62,0x85),//purple
        color(0x68,0x9d,0x6a)]//aqua
}
