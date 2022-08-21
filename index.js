const can=document.querySelector("canvas")
const ctx=can.getContext("2d")
const w=500
const h=500
can.width=w
can.height=h
can.style.border='1px solid'
class player{
    constructor(x,y,dw,dh,dt){
        this.x=x
        this.y=y
        this.w=dw
        this.h=dh
        this.vy=0
        this.tails=new Array(20).fill(0).map(()=>new Array(3).fill(0))
    }
    draw(){
        ctx.fillStyle='red'
        ctx.beginPath()
        ctx.rect(this.x,this.y,this.w,this.h)
        ctx.fill()
        ctx.closePath()
        for(let i=0;i<20;i++){
            ctx.beginPath()
            ctx.rect(this.tails[i][0],this.tails[i][1],this.tails[i][2],this.tails[i][2])
            ctx.fill()
            ctx.closePath()
        }
    }
    adddust(){
        for(let i=0;i<20;i++){
            this.tails[i]=[this.x+Math.random()*this.w,this.y+this.h+Math.random(),Math.random()*10]
        }
    }
    update(){
        this.y+=this.vy*0.5
        this.vy+=0.5
        if(this.y+this.h>h){
            this.y=h-this.h
        }
        if(this.y<0){
            this.y=0
        }
        for(let i=0;i<20;i++){
            this.tails[i][0]-=(Math.random()*2-1)
            this.tails[i][1]+=Math.random()
            this.tails[i][2]-=0.4
            if(this.tails[i][2]<0){
                this.tails[i][2]=0
                this.tails[i][0]=0
                this.tails[i][1]=0
            }
        }
    }
}
class tubes{
    constructor(x,y,l){
        this.x=x
        this.l=l
        this.y=y
        this.w=75
        this.speed=2
    }
    isCollided(player){
        if (this.x < player.x + player.w &&
            this.x + this.w > player.x &&
            this.y < player.y + player.h &&
            this.l + this.y > player.y){
                return true
            }
        return false
    }
    draw(){
        ctx.fillStyle="blue"
        ctx.beginPath()
        ctx.rect(this.x,this.y,this.w,this.l)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.x-=this.speed
    }
}

var fps=60;
var fpsInterval=1000/fps;

var then=Date.now()
let now,elated

class game{
    constructor(){
        this.player=new player(70,h/2,40,40)
        this.walls=[]
        this.gameOver=false
        this.count=0
        this.tcount=200
    }
    reset(){
        this.gameOver=false
        this.count=0
        this.walls=[]
    }
    draw(){
        this.player.draw()
        for(let wall of this.walls){
            wall.draw()
        }
    }
    update(){
        this.player.update()
        for(let i=0;i<this.walls.length;i++){
            this.walls[i].update()
        }
        this.walls=this.walls.filter(e=>{
            return e.x+e.w>0
        })
    }
    run(){
        this.draw()
        this.update()
        for(let wall of this.walls){
            this.gameOver = wall.isCollided(this.player)
            if(this.gameOver){
                break
            }
        }
        this.count+=1
        if(this.count==this.tcount){
            this.getWall()
            this.count=0
            this.tcount=90+Math.random()*100>>0
        }
    }
    getWall(){
        let x1=w
        let x2=x1+Math.random()*50>>0
        let l1=Math.random()*370>>0
        let l2=Math.random()*(370-l1)>>0
        if(l1<100 && l2<100){
            l2=100+l2
        }
        this.walls.push(new tubes(x1,0,l1))
        this.walls.push(new tubes(x2,h-l2,l2))
    }

}

const flappy=new game()
document.onclick=()=>{
    flappy.player.vy=-10
    flappy.player.adddust()
}
// document.ondblclick=()=>{
//     flappy.player.vy=-13
//     flappy.player.adddust()
// }
function animate(){
    requestAnimationFrame(animate)
    now=Date.now()
    elated=now-then
    if(elated>fpsInterval){
        ctx.clearRect(0,0,w,h)
        flappy.run()
        if(flappy.gameOver){
            flappy.reset()
        }
        then=now-(elated%fpsInterval)
    }
} 
animate()