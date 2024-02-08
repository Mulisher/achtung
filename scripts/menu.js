const forbiddenKeys = [' ','Tab','Escape','CapsLock','NumLock']

function menu(){
    textSize(w/20)
    fill(fgC)
    noStroke()
    text(title,w/2,h/12)
    textSize(w/60)
    push()
    textAlign(LEFT,CENTER)
    text(ver,w*22/30,h/10)
    pop()

    const offset = 2*h/14
    const mx = w/100
    const mw = w*3/4
    const mh = offset - w/100
    strokeWeight(w/200)
    for(let i = 0; i < 6; i++){
        let txtF
        let txtS
        if(activePlayer[i]){
            fill(pColors[i])
            txtF = fgC
            txtS = pColors[i]
        }else{
            txtF = pColors[i]
            txtS = bgC
            noFill()
        }
        stroke(pColors[i])
        const my = offset + (height - offset)/6*i
        rect(mx,my,mw,mh)
        fill(txtF)
        stroke(txtS)
        textSize(w/20)
        const ty = my+offset/2
        text(playerNames[i]  ,mw/2  ,ty)
        text(playerKeys[i][0],mw/4  ,ty)
        text(playerKeys[i][1],mw*3/4,ty)
    }

    stroke(fgC)
    noFill()
    const ox = mw+2*mx
    const ow = w/4.5
    rect(ox,offset,ow,h - offset*1.1)
    fill(fgC)
    noStroke()
    textSize(w/10)
    text(goalScore,ox+ow/2,offset*2)
    for(let mb of menuButtons){
        mb.draw()
    }

    if(controlsChanging){
        controlsChangeMenu()
    }else{
        for(let pb of playerButtons){
            pb.draw()
        }
    }
}

function controlsChangeMenu(){
    const bh = h/5
    stroke(fgC)
    strokeWeight(w/200)
    fill(pColors[controlsChangingId])
    rect(bh,h/2-bh/2,w-2*bh,bh)
    fill(fgC)
    noStroke()
    textSize(w/20)
    switch (controlsChangingN){
        case 0:
            text('Press LEFT',w/2,h/2)
            break
        case 1:
            text('Press RIGHT',w/2,h/2)
            break
        case 2:
            controlsChanging = false
            return
    }
    if(!keyLockout && key != null && !isKeyForbidden(key)){
        playerKeys[controlsChangingId][controlsChangingN] = key
        key = null
        controlsChangingN ++
    }
}

function makeMenu(){
    let offset = h/7
    let bx = w/100
    let bw = w*3/4
    let bh = offset - w/100
    for(let i = 0; i < 6; i++){
        let b = new Clickable()
        let by = offset + (height - offset)/6*i
        b.cornerRadius = 0
        b.stroke = pColors[i]
        b.color = color(0,0,0,0)
        b.locate(bx,by)
        b.resize(bw,bh)
        b.textSize = i //chujowy workaround
        b.text = ""
        b.onPress = function(){
            key = null
            if(activePlayer[this.textSize] === false){
                changeControls(this.textSize)
            }
            activePlayer[this.textSize] = !activePlayer[this.textSize]
        }
        playerButtons.push(b)
    }

    let mbx = bw+3*bx
    const mbw = w/(9)-bx
    const mby = offset*2.5
    const mbh = offset
    let b = new Clickable()
    b.cornerRadius = 0
    b.stroke = color(0,0,0,0)
    b.color = fgC
    b.locate(mbx,mby)
    b.resize(mbw,mbh)
    b.textSize = w/15
    b.text = "-"
    b.onPress = function(){
        if(goalScore > 1 && !controlsChanging)goalScore --
    }
    menuButtons.push(b)

    mbx = mbx+mbw
    b = new Clickable()
    b.cornerRadius = 0
    b.stroke = color(0,0,0,0)
    b.color = fgC
    b.locate(mbx,mby)
    b.resize(mbw,mbh)
    b.textSize = w/15
    b.text = '+'
    b.onPress = function(){
        if(goalScore < 99 && !controlsChanging)goalScore ++
    }
    menuButtons.push(b)
}

function changeControls(pid){
    controlsChanging = true
    controlsChangingN = 0
    controlsChangingId = pid
    playerKeys[pid][0] = ' '
    playerKeys[pid][1] = ' '
}

function isKeyForbidden(k){
    for(let i = 0; i < playerKeys.length; i++){
        if(k === playerKeys[i][0] || k === playerKeys[i][1]){
            return true
        }
    }
    if (forbiddenKeys.includes(k))return true
    return false
}
