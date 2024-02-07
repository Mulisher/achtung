//TODO
//2 rozne randomy?
//wysyp znajdziek?
//chyba poparawki na romzar itp powinny być wewnatrz
//"first tick"
const pickupTypes = ['speed_self',
                    'speed_others',
                    'slow_self',
                    'slow_others',

                    'fat_self',
                    'fat_others',
                    'thin_self',
                    'thin_others',

                    'clear_all_trails',
                    'clear_my_trail',
                    'tron_self',
                    'tron_others',

                    'no_walls',
                    'wall_hack',
                    'ghost',
                    'random']

class Pickup{
    constructor(){
        this.id = this.generateId()
        const sx = w/50+random(gameBorder-(w/50)*2)
        const sy = w/50+random(h-(w/50)*2)
        this.position = createVector(sx,sy)
        const rand = Math.floor(random(pickupTypes.length))
        //this.type = pickupTypes[rand]
        this.type = 'speed_self'
        this.r = w/50
        this.picked = false
        this.firstTick = true
        this.pickedById = -1
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
            if(p.id == this.pickedById){
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
                    if(p.id != this.pickedById){
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
                    if(p.id != this.pickedById){
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
                    if(p.id != this.pickedById){
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
                    if(p.id != this.pickedById){
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
                    p.id != this.id &&
                    p.type == this.type &&
                    p.pickedById == this.pickedById){
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
                    if(p.id != this.pickedById){
                        this.affected.push(p.id)
                        p.tron = true
                    }
                }
            }
            for(let p of players){
                if(p.id != this.pickedById){
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
                    p.id != this.id &&
                    p.type == this.type &&
                    p.pickedById == this.pickedById){
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
                if(p.picked && p.id != this.id && p.type == this.type){
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
                    p.id != this.id &&
                    p.type == this.type &&
                    p.pickedById == this.pickedById){
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
            if(aId == p.id)return p
        }
    }

    removeAffected(pId){
        for(let i = this.affected.length - 1; i >= 0; i--){
            if(this.affected[i] == pId){
                this.affected.splice(i,1)
            }
        }
    }

    display(){
        if(this.picked)return
        const pos = this.position
        switch (this.type){
            case 'speed_self':
                this.ShowSpeedSelf(pos)
                break
            case 'speed_others':
                this.ShowSpeedOthers(pos)
                break
            case 'slow_self':
                this.ShowSlowSelf(pos)
                break
            case 'slow_others':
                this.ShowSlowOthers(pos)
                break
            case 'fat_self':
                this.ShowFatSelf(pos)
                break
            case 'fat_others':
                this.ShowFatOthers(pos)
                break
            case 'thin_self':
                this.ShowThinSelf(pos)
                break
            case 'thin_others':
                this.ShowThinOthers(pos)
                break
            case 'tron_self':
                this.ShowTronSelf(pos)
                break
            case 'tron_others':
                this.ShowTronOthers(pos)
                break
            case 'clear_all_trails':
                this.ShowClearAllTrails(pos)
                break
            case 'clear_my_trail':
                this.ShowClearMyTrail(pos)
                break
            case 'ghost':
                this.ShowGhost(pos)
                break
            case 'no_walls':
                this.ShowNoWalls(pos)
                break
            case 'wall_hack':
                this.ShowWallHack(pos)
                break
            case 'random':
                this.ShowRandom(pos)
                break
            default:
        }
    }

    ShowSpeedSelf(pos){
        this.textIconSelf(pos,'\u2b4d')
    }
    ShowSpeedOthers(pos){
        this.textIconOther(pos,'\u2b4d')
    }
    ShowSlowSelf(pos){
        this.textIconSelf(pos,'\u2a54')
    }
    ShowSlowOthers(pos){
        this.textIconOther(pos,'\u2a54')
    }
    ShowFatSelf(pos){
        this.textIconSelf(pos,'\u2501')
    }
    ShowFatOthers(pos){
        this.textIconOther(pos,'\u2501')
    }
    ShowThinSelf(pos){
        this.textIconSelf(pos,'\u23bb')
    }
    ShowThinOthers(pos){
        this.textIconOther(pos,'\u23bb')
    }
    ShowTronSelf(pos){
        this.textIconSelf(pos,'\u2ba3')
    }
    ShowTronOthers(pos){
        this.textIconOther(pos,'\u2ba3')
    }
    ShowClearAllTrails(pos){
        this.textIcon(pos,'\u2505')
    }
    ShowClearMyTrail(pos){
        this.textIconSelf(pos,'\u2505')
    }
    ShowGhost(pos){
        this.textIconSelf(pos,'\u233e')
    }
    ShowNoWalls(pos){
        this.textIcon(pos,'\u26f6')
    }
    ShowWallHack(pos){
        this.textIconSelf(pos,'\u2346')
    }
    ShowRandom(pos){
        this.textIcon(pos,'?')
    }

    textIcon(pos,txt){
        push()
        let ofs = w/500
        translate(pos.x,pos.y)
        noStroke()
        fill(lColors[1])
        ellipse(0,-ofs,this.r,this.r)
        textSize(w/50)
        fill(color(0xfb,0xf1,0xc7))
        text(txt,0,0)
        pop()
    }

    textIconSelf(pos,txt){
        push()
        let ofs = w/500
        translate(pos.x,pos.y)
        noStroke()
        fill(lColors[2])
        ellipse(0,-ofs,this.r,this.r)
        textSize(w/50)
        fill(color(0xfb,0xf1,0xc7))
        text(txt,0,0)
        pop()
    }

    textIconOther(pos,txt){
        push()
        let ofs = w/500
        translate(pos.x,pos.y)
        noStroke()
        fill(lColors[0])
        ellipse(0,-ofs,this.r,this.r)
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

    remove(){
        this.toBeRemoved = true
    }

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
        switch (this.type){
            case 'speed_self':
                return 30*4
            case 'speed_others':
                return 30*4
            case 'slow_self':
                return 30*4
            case 'slow_others':
                return 30*4
            case 'fat_self':
                return 30*8
            case 'fat_others':
                return 30*8
            case 'thin_self':
                return 30*8
            case 'thin_others':
                return 30*8
            case 'tron_self':
                return 30*8
            case 'tron_others':
                return 30*8
            case 'ghost':
                return 30*8
            case 'no_walls':
                return 30*10
            case 'wall_hack':
                return 30*10
            default:
                return 0
        }
    }

}
