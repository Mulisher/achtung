const pickupTypes = [
                    ['speed_self','\u2b4d','self'],
                    ['speed_others','\u2b4d','others'],
                    ['slow_self','\u2a54','self'],
                    ['slow_others','\u2a54','others'],

                    ['fat_self','\u2501','self'],
                    ['fat_others','\u2501','others'],
                    ['thin_self','\u23bb','self'],
                    ['thin_others','\u23bb','others'],

                    ['clear_all_trails','\u2505','none'],
                    ['clear_my_trail','\u2505','self'],
                    ['tron_self','\u2ba3','self'],
                    ['tron_others','\u2ba3','others'],

                    ['no_walls','\u26f6','none'],
                    ['wall_hack','\u2346','none'],
                    ['ghost','\u233e','none'],
                    ['random','?','none']
]

class Pickup{
    constructor(fps){
        this.id = this.generateId()
        const sx = w/50+random(gameBorder-(w/50)*2)
        const sy = w/50+random(h-(w/50)*2)
        this.position = createVector(sx,sy)
        this.typeId = Math.floor(random(pickupTypes.length))
        this.type = pickupTypes[this.typeId][0]
        //this.type = 'fat_self'
        this.r = w/50
        this.picked = false
        this.firstTick = true
        this.pickedById = -1
        this.fps = fps
        this.timeLeft = this.provideDuration()
        this.affected = []
    }

    update(){
        if(this.checkIfPickedUp()){
            this.picked = true
        }
        if(!this.picked)return
        switch (this.type){
            case 'speed_self':
                this.speedSelf()
                break
            case 'speed_others':
                this.speedOthers()
                break
            case 'slow_self':
                this.slowSelf()
                break
            case 'slow_others':
                this.slowOthers()
                break
            case 'fat_self':
                this.fatSelf()
                break
            case 'fat_others':
                this.fatOthers()
                break
            case 'thin_self':
                this.thinSelf()
                break
            case 'thin_others':
                this.thinOthers()
                break
            case 'tron_self':
                this.tronSelf()
                break
            case 'tron_others':
                this.tronOthers()
                break
            case 'clear_all_trails':
                this.clearAllTrails()
                break
            case 'clear_my_trail':
                this.clearMyTrail()
                break
            case 'ghost':
                this.ghost()
                break
            case 'no_walls':
                this.noWalls()
                break
            case 'wall_hack':
                this.wallHack()
                break
            case 'random':
                this.random()
                break
            default:
        }
    }

    getWhoPicked(){
        for(let p of players){
            if(p.id === this.pickedById){
                return p
            }
        }
    }

    speedSelf(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                let p = this.getWhoPicked()
                p.velocity.setMag(p.velocity.mag()*2)
                p.holeSize /= 2
                this.firstTick = false
            }
            this.timeLeft--
        }else{
            let p = this.getWhoPicked()
            p.velocity.setMag(p.velocity.mag()/2)
            p.holeSize *= 2
            this.remove()
        }
    }

    speedOthers(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                this.affected = []
                this.firstTick = false
                for(let p of players){
                    if(p.id !== this.pickedById){
                        this.affected.push(p.id)
                        p.velocity.setMag(p.velocity.mag()*2)
                        p.holeSize /= 2
                    }
                }
            }
            this.timeLeft--
        }else{
            for(let p of players){
                if(this.affected.includes(p.id)){
                    p.velocity.setMag(p.velocity.mag()/2)
                    p.holeSize *= 2
                }
            }
            this.remove()
        }
    }

    slowSelf(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                let p = this.getWhoPicked()
                p.velocity.setMag(p.velocity.mag()/2)
                p.holeSize *= 2
                this.firstTick = false
            }
            this.timeLeft--
        }else{
            let p = this.getWhoPicked()
            p.velocity.setMag(p.velocity.mag()*2)
            p.holeSize /= 2
            this.remove()
        }
    }

    slowOthers(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                this.affected = []
                this.firstTick = false
                for(let p of players){
                    if(p.id !== this.pickedById){
                        this.affected.push(p.id)
                        p.velocity.setMag(p.velocity.mag()/2)
                        p.holeSize *= 2
                    }
                }
            }
            this.timeLeft--
        }else{
            for(let p of players){
                if(this.affected.includes(p.id)){
                    p.velocity.setMag(pl.velocity.mag()*2)
                    p.holeSize /= 2
                }
            }
            this.remove()
        }
    }

    fatSelf(){
        let pl = this.getWhoPicked()
        if(this.timeLeft > 0){
            if(this.firstTick){
                pl.interuptTrail()
                pl.size *= 2
                pl.holeSize *= 1.75
                this.firstTick = false
            }
            if(pl.size > baseSize*4){
                pl.size /= 2
                pl.holeSize /= 1.75
                this.remove()
            }
            this.timeLeft--
        }else{
            pl.interuptTrail()
            pl.size /= 2
            pl.holeSize /= 1.75
            this.remove()
        }
    }

    fatOthers(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                this.affected = []
                this.firstTick = false
                for(let p of players){
                    if(p.id !== this.pickedById){
                        this.affected.push(p.id)
                        p.interuptTrail()
                        p.size *= 2
                        p.holeSize *= 1.75
                    }
                }
            }
            for(let p of players){
                if(p.size > baseSize*4){
                    p.size /= 2
                    p.holeSize /= 1.75
                    this.removeAffected(p.id)
                }
            }
            this.timeLeft--
        }else{
            for(let p of players){
                if(this.affected.includes(p.id)){
                    p.interuptTrail()
                    p.size /= 2
                    p.holeSize /= 1.75
                }
            }
            this.remove()
        }
    }

    thinSelf(){
        let pl = this.getWhoPicked()
        if(this.timeLeft > 0){
            if(this.firstTick){
                pl.interuptTrail()
                pl.size /= 2
                pl.holeSize /= 1.25
                this.firstTick = false
            }
            if(pl.size < baseSize/4){
                pl.size *= 2
                pl.holeSize *= 1.25
                this.remove()
            }
            this.timeLeft--
        }else{
            pl.interuptTrail()
            pl.size *= 2
            pl.holeSize *= 1.25
            this.remove()
        }
    }

    thinOthers(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                this.affected = []
                this.firstTick = false
                for(let p of players){
                    if(p.id !== this.pickedById){
                        this.affected.push(p.id)
                        p.interuptTrail()
                        p.size /= 2
                        p.holeSize /= 1.25
                    }
                }
            }
            for(let p of players){
                if(p.size < baseSize/2){
                    p.size *= 2
                    p.holeSize *= 1.25
                    this.removeAffected(pId)
                }
            }
            this.timeLeft--
        }else{
            for(let p of players){
                if(this.affected.includes(p.id)){
                    p.interuptTrail()
                    p.size *= 2
                    p.holeSize *= 1.25
                }
            }
            this.remove()
        }
    }

    clearAllTrails(){
        for(let p of players){
            p.history = []
        }
        this.remove()
    }

    clearMyTrail(){
        let p = this.getWhoPicked()
        p.history = []
        this.remove()
    }

    tronSelf(){
        let pl = this.getWhoPicked()
        if(this.timeLeft > 0){
            pl.tron = true
            this.timeLeft--
        }else{
            let otherTron = false
            for(let p of pickups){
                if(p.picked &&
                    p.id !== this.id &&
                    p.type === this.type &&
                    p.pickedById === this.pickedById){
                    otherTron = true
                }
            }
            if(!otherTron){
                pl.tron = false
            }
            this.remove()
        }
    }

    tronOthers(){
        if(this.timeLeft > 0){
            if(this.firstTick){
                this.affected = []
                this.firstTick = false
                for(let p of players){
                    if(p.id !== this.pickedById){
                        this.affected.push(p.id)
                        p.tron = true
                    }
                }
            }
            for(let p of players){
                if(p.id !== this.pickedById){
                    this.affected.push(p.id)
                    p.tron = true
                }
            }
            this.timeLeft--
        }else{
            for(let p of players){
                if(this.affected.includes(p.id)){
                    p.tron = false
                }
            }
            this.remove()
        }
    }

    ghost(){
        let pl = this.getWhoPicked()
        if(this.timeLeft > 0){
            pl.ghost = true
            this.timeLeft--
        }else{
            let otherGhost = false
            for(let p of pickups){
                if(p.picked &&
                    p.id !== this.id &&
                    p.type === this.type &&
                    p.pickedById === this.pickedById){
                    otherGhost = true
                }
            }
            if(!otherGhost){
                pl.ghost = false
            }
            this.remove()
        }
    }

    noWalls(){
        if(this.timeLeft > 0){
            walls = false
            this.timeLeft--
        }else{
            let otherNoWalls = false
            for(let p of pickups){
                if(p.picked && p.id !== this.id && p.type === this.type){
                    otherNoWalls = true
                }
            }
            if(!otherNoWalls){
                walls = true;
            }
            this.remove()
        }
    }

    wallHack(){
        let pl = this.getWhoPicked()
        if(this.timeLeft > 0){
            pl.wallHack = true
            this.timeLeft--
        }else{
            let otherWallHacks = false
            for(let p of pickups){
                if(p.picked &&
                    p.id !== this.id &&
                    p.type === this.type &&
                    p.pickedById === this.pickedById){
                    otherWallHacks = true
                }
            }
            if(!otherWallHacks){
                pl.wallHack = false
            }
            this.remove()
        }
    }

    random(){
        const rand = Math.floor(random(pickupTypes.length))
        this.type = pickupTypes[rand]
        this.update()
    }

    getAffected(aId){
        for(let p of players){
            if(aId === p.id)return p
        }
    }

    removeAffected(pId){
        for(let i = this.affected.length - 1; i >= 0; i--){
            if(this.affected[i] === pId){
                this.affected.splice(i,1)
            }
        }
    }

    display(){
        if(this.picked)return
        const pos = this.position
        this.textIcon(pos,pickupTypes[this.typeId][1],pickupTypes[this.typeId][2]) 
    }

    textIcon(pos,txt,t){
        push()
        translate(pos.x,pos.y)
        noStroke()
        switch(t){
            case "self":
                fill(lColors[2])
                break
            case "others":
                fill(lColors[0])
                break
            case "none":
                fill(lColors[1])
                break
        }
        ellipse(0,0,this.r,this.r)
        textSize(w/50)
        fill(color(0xfb,0xf1,0xc7))
        text(txt,0,0)
        pop()
    }

    generateId(){
        let exsistingIds = []
        for(let p of pickups){
            exsistingIds.push(p.id)
        }
        let newId = Math.floor(random(100000))
        while(exsistingIds.includes(newId)){
            newId = Math.floor(random(100000))
        }
        return newId
    }

    remove(){ this.toBeRemoved = true }

    checkIfPickedUp(){
        if(this.picked)return false
        const pos = this.position
        let min = 9999
        let whoIsClosest
        for(let p of players){
            const pl = p.position
            const d = dist(pl.x,pl.y,pos.x,pos.y)
            if(d < min){
                min = d
                whoIsClosest = p.id
            }
        }
        if(min < this.r){
            this.pickedById = whoIsClosest
            return true
        }
        return false
    }

    provideDuration(){
        const durations = {
            'wall_hack':(this.fps*10),
            'no_walls':(this.fps*10),
            'ghost':(this.fps*8),
            'tron_others':(this.fps*8),
            'tron_self':(this.fps*8),
            'thin_others':(this.fps*8),
            'thin_self':(this.fps*8),
            'fat_others':(this.fps*8),
            'fat_self':(this.fps*8),
            'slow_others':(this.fps*4),
            'slow_self':(this.fps*4),
            'speed_others':(this.fps*4),
            'speed_self':(this.fps*4)
        }
        return durations[this.type]
    }

}
