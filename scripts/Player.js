class Player{
    constructor(id){
        this.id = id
        this.color = pColors[id]
        this.score = 0
        this.resetForStart()
    }

    resetForStart(){
        const sx = w/50+random(gameBorder-(w/50)*2)
        const sy = w/50+random(h-(w/50)*2)
        this.position = createVector(sx,sy)
        this.velocity = createVector(1,1)
        this.velocity.setMag(baseSpeed)
        this.velocity.rotate( radians( random(360) ) )
        this.size = baseSize
        this.history = []
        this.recentHole = 25
        this.holeSize = 5
        this.makingHole = 0
        this.alive = true
        this.wallHack = false
        this.ghost = false
        this.tron = false
        this.lLock = false
        this.rLock = false
    }

    update(){
        if(!this.alive)return

        if(this.tron){
            const rot = radians(90)
            if(controls[this.id][0] && !this.lLock){
                this.velocity.rotate(-rot)
                this.lLock = true
            }
            if(controls[this.id][1] && !this.rLock){
                this.velocity.rotate(rot)
                this.rLock = true
            }
            if(!controls[this.id][0])this.lLock = false
            if(!controls[this.id][1])this.rLock = false
        }
        else{
            if(controls[this.id][0]){this.velocity.rotate(-rotS)}
            if(controls[this.id][1]){this.velocity.rotate(rotS)}
        }

        const pos = this.position.copy()
        if(this.makingHole > 0){
            this.history.push([pos,true,this.size])
            this.makingHole --
        }
        else if( random(100) < 4 && this.recentHole < 0 || this.ghost ){
            this.history.push([pos,true,this.size])
            this.recentHole = 25
            this.makingHole = this.holeSize
        }
        else{
            this.history.push([pos,false,this.size])
            this.recentHole --
        }
        this.position.add(this.velocity)
    }

    display(){
        if(pause){
            push()
            translate(this.position.x,this.position.y)
            stroke(fgC)
            strokeWeight(2)
            let sl = this.velocity.copy().setMag(20)
            line(0,0,sl.x,sl.y)
            pop()
        }
        this.drawTrail()
        strokeWeight(1)
        if(this.wallHack){
            fill  (fgC)
            stroke(fgC)
        }else{
            fill  (this.color)
            stroke(this.color)
        }
        if(this.tron){
            push()
            rectMode(CENTER)
            translate(this.position.x,this.position.y)
            rotate(this.velocity.heading())
            rect(0,0,this.size*2,this.size*2)
            pop()
        }else{
            ellipse(this.position.x,this.position.y,this.size*2,this.size*2)
        }
    }

    drawTrail(){
        stroke(this.color)
        noFill()
        beginShape()
        for(let i = 0; i < this.history.length; i++){
            strokeWeight(this.history[i][2]*2)
            let hp = this.history[i][0];
            if(this.history[i][1] === true){
                endShape()
                beginShape()
            }else{
                vertex(hp.x,hp.y)
            }
        }
        endShape()
    }

    checkCollision(){
        const pos = this.position
        const bT = borderThickness/2
        const s = this.size
        let xr = pos.x + s > gameBorder - bT
        let xl = pos.x - s < bT
        let yd = pos.y + s > height - bT
        let yu = pos.y - s < bT

        if(xr | xl | yd | yu){
            if(walls && !this.wallHack && !this.ghost){
                this.crash()
            }
            else{
                this.interuptTrail()
                if(xr)     { this.position.x = 1+s+bT }
                else if(xl){ this.position.x = gameBorder-bT-1 }
                if(yd)     { this.position.y = 1+s+bT }
                else if(yu){ this.position.y = height-s-bT-1 }
                this.interuptTrail()
            }
        }

        if(this.ghost)return
        if(this.checkSelfHit()){
            this.crash()
            return
        }

        for(let p of players){
            if(p.id !== this.id && p.checkOtherHit(pos,s)){
                this.crash()
                return
            }
        }
    }

    checkOtherHit(pos,siz){
        for(let i = 0; i < this.history.length; i++){
            let tp = this.history[i][0]
            let hole = this.history[i][1]
            let d = siz + this.history[i][2]
            let test = dist(pos.x,pos.y, tp.x,tp.y) < d
            if(!hole & test){
                return true
            }
        }
        return false
    }

    checkSelfHit(){
        let skip = this.size * 2
        for(let i = 0; i < this.history.length - skip; i++){
            let tp = this.history[i][0]
            let pos = this.position
            let hole = this.history[i][1]
            let d = this.size + this.history[i][2]
            let test = dist(pos.x,pos.y, tp.x,tp.y) < d
            if(!hole & test){
                return true
            }
        }
        return false
    }

    interuptTrail(){
        let pos = this.position
        this.history.push([pos,true,this.size])
    }

    crash(){
        this.alive = false
        this.giveScore()
        checkRoundWin()
    }

    giveScore(){
        for(let p of players){
            if(p.id !== this.id & p.alive)p.score ++
        }
    }
}
