const audiocoin = new Audio();
audiocoin.src = "/Assets/sounds/kaching.mp3"

const audiodoge = new Audio();
audiodoge.src ="/Assets/sounds/woof.mp3"

const audiogameover = new Audio();
audiogameover.src ="/Assets/sounds/youlost.mp3"

const audiowin = new Audio();
audiowin.src ="/Assets/sounds/banana.mp3"

const canvas = document.getElementById("canvas")

const ctx = canvas.getContext("2d")

let frames  = 0
let requestID;
let points = 0
let wallet = 0;

const boyImgs = [
    "/Assets/boy_sprite1.png",
    "/Assets/boy_sprite2.png"
]

let enemies = [];
let bullets = [];
let bitcoins = [];


class Hero {
    constructor(x,y,w,h,imgs){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.image1 = new Image();
        this.image1.src = imgs[0];

        this.image2 = new Image();
        this.image2.src = imgs[1];

        this.image = this.image1
        this.live = 3;
    }



    draw(){
        if(this.y <= 410) this.y += 2
        if(frames % 10 === 0){
            this.image = this.image === this.image1 ? this.image2 : this.image1
        }
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }

    collision(enemy){
        return(
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x  &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y
        ) 
    }


}

class Background{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image ()
        this.image.src = "/Assets/pixel-art-game-background-grass-sky-clouds_210544-60.jpeg"
    }

    gameOver(){
        ctx.font ="80px Arial" 
        ctx.fillText("¡Te estafaron!",150,300)
        audiogameover.play()
    }
    youwon(){
        ctx.font ="80px Arial" 
        ctx.fillText("When Lambo?",150,300)
        audiowin.play()
    }

    draw(){
        
        this.x --;
        if(this.x < -canvas.width) this.x = 0;
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(
            this.image,
            this.x + canvas.width,
            this.y,
            this.width,
            this.height
        )

    }
}

class Enemi{
    constructor(){
        this.x = canvas.width;
        this.y = 382;
        this.width = 80;
        this.height = 80;
        //imagen
        this.image = new Image();
        this.image.src ="/Assets/enemy_sprite2.png"
    }

    draw(){
        if(frames % 10 ) this.x -= 5;


        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }

}

class Coin{
    constructor(){
        this.x = Math.floor(Math.random()*(780-120)+120);
        this.y = 0;
        this.width = 30;
        this.height = 30;
        this.image = new Image();
        this.image.src ="/Assets/bitcoin.png"
    }
    draw(){
     this.y += 5;
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}

class Bullet{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 30
        this.height = 30
        this.image = new Image()
        this.image.src = "/Assets/doge.png"
    }

    draw(){
        this.x +=2
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)

    }

    collision(enemy){
        return(
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x  &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y
        ) 
    }
}

const vitalik = new Hero(100,410,50,50,boyImgs)
const fondo = new Background()

function update(){
  
    ctx.clearRect(0,0,canvas.width,canvas.height)
    frames ++;
    fondo.draw()

    vitalik.draw()
    generateEnemies()
    generateCoins()
    drawEnemies()
    drawCoins()

   
    ctx.font = "30px Arial"
    ctx.fillText(points,450,80)
    ctx.fillText(wallet,250,80)

    if(requestID){
       requestID =  requestAnimationFrame(update)
    }
    

}

function start(){
   requestID =  requestAnimationFrame(update)
   
}



function gameOver(){
    fondo.gameOver()
    requestID = undefined
}



function youwon(){
    fondo.youwon()
    requestID = undefined
}


function generateCoins(){
    if(frames % 100 === 0 || frames % 60 === 0 || frames % 200 ===  0){
       
        const coin = new Coin()
        bitcoins = [...bitcoins,coin]
    }

}

function generateEnemies(){
    if(frames % 100 === 0 || frames % 60 === 0 || frames % 200 ===  0){
        let widthRan = Math.floor(Math.random() * 300 )

        let x = Math.floor(Math.random() * canvas.width - 400 )
       
        const enemy = new Enemi(widthRan, x)
        enemies = [...enemies,enemy]
    }


}


function  generateBullet(){
    const bullet = new Bullet(vitalik.x+vitalik.width,vitalik.y)
   audiodoge.currentTime=0;
            audiodoge.play()
        bullets = [...bullets,bullet]

}

function drawCoins(){
    bitcoins.forEach((coin,index_coins)=>{
        coin.draw()
        if(coin.x + coin.width <= 0){
            bitcoins.splice(index_coins,1)
        }
        if(vitalik.collision(coin)){
            bitcoins.splice(index_coins,1)
            wallet +=1
            audiocoin.currentTime=0;
            audiocoin.play()
        }
        if(wallet >= 10){
            youwon()
        }
    }
    )
}

function drawEnemies(){
    enemies.forEach((enemy,index_enemy)=>{
        enemy.draw()
        

        bullets.forEach((bullet,index_bullet)=>{
            bullet.draw()
            if(bullet.collision(enemy)){
                enemies.splice(index_enemy,1)
                bullets.splice(index_bullet,1)
             points += 10
            }
            if(bullet.x+bullet.width > canvas.width){
                bullets.splice(index_bullet,1)
            }

        })

    if(vitalik.collision(enemy)){
        vitalik.live -=1;
        if(vitalik.live <= 0){
            gameOver()
        }   
    }

    if(enemy.x + enemy.width <= 0 ){
        enemies.splice(index_enemy,1)
    }

    })

    
}

//movimiento
addEventListener("keydown", (event)=>{
    if(event.keyCode === 37){
        vitalik.x -= 20;
    }
 
    if(event.keyCode === 39){
        vitalik.x += 20
    }
 
    if(event.keyCode === 38){
        vitalik.y -= 60;
    }

    if(event.keyCode === 32){
        generateBullet()
    }

    if(event.keyCode === 13){
        start()
    }
    
})