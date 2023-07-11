import {Bullet} from './bullet.js'

export class Player {
    constructor(game) {
        this.game = game
        this.sizeModifier = 0.15
        this.width = 395 * this.sizeModifier
        this.height = 488 * this.sizeModifier
        this.x = this.game.platforms.filter(platform => platform.type=='green').slice(-1)[0].x + 6 // Uso el .x para acceder a la this.x de el objeto platform 
        this.y = this.game.platforms.filter(platform => platform.type=='green').slice(-1)[0].y - this.height 
        this.min_y = (this.game.height/2)-20
        this.min_vy = -17
        this.max_vy = this.game.platforms[0].height
        this.vy = this.min_vy     
        this.weight = 0.4
        this.image = document.querySelector('#doodler-right')
        this.vx = 0
        this.max_vx = 7
        this.bullets = []
    }

    update(inputHandler) {
        // horizontal movement
        this.x += this.vx
        if (inputHandler.keys.includes('ArrowLeft')){
            this.image = document.querySelector('#doodler-left')
            this.vx = -this.max_vx
        } else if (inputHandler.keys.includes('ArrowRight')){
            this.image = document.querySelector('#doodler-right')
            this.vx = this.max_vx
        }
        else this.vx = 0

        // limite horizontal (atraviese)
        if (this.x < -this.width/2) this.x = this.game.width - (this.width/2) // Atraviesa izq = der
        if (this.x + (this.width/2) > this.game.width) this.x = - this.width/2 // Atraviesa der = izq

        // vertical movement
        if (this.vy > this.weight) {  
            let platformType = this.onPlatform()
            if (platformType=='green') this.vy = this.min_vy 
            if (platformType=='green') new Audio('/assets/source/sound effects/jump.wav').play()
            if (platformType=='brown') new Audio('/assets/source/sound effects/no_jump.wav').play()
        }

        if (this.vy < this.max_vy) this.vy += this.weight
        if (this.y > this.min_y || this.vy > this.weight) this.y += this.vy

        if(this.y <= this.min_y && this.vy < this.weight) this.game.vy = -this.vy 
        else this.game.vy = 0

        // game over
        if(this.collision()) {
            this.game.gameOver = true
            this.game.enemies.forEach((enemy)=>{
                enemy.audio.pause()
            })
            new Audio('/assets/source/sound effects/crash.mp3').play() 
        }

        if(this.y > this.game.height && !this.game.gameOver) {
            this.game.gameOver = true
            this.game.enemies.forEach((enemy)=>{
                enemy.audio.pause()
            })
            new Audio('/assets/source/sound effects/fall.mp3').play()
        }

        // bullet
        if(inputHandler.bulletKeyCount>0) {
            inputHandler.bulletKeyCount--
            this.bullets.push(new Bullet(this))
        }

        this.bullets.forEach(bullet => bullet.update())
        this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion)
    }

    draw(context) {        
        this.bullets.forEach(bullet => bullet.draw(context))
        context.drawImage(this.image,this.x,this.y,this.width,this.height)
    }


     // Colisiones con plataformas y enemigos (creamos variable playerHitbox para que el game detecte cuando la hitbox está tocando una nueva plataforma o un enemigo)

    collision() {
        let result = false
        let playerHitBox = {x:this.x+15, y:this.y, width:this.width-30, height:this.height}
        this.game.enemies.forEach((enemy)=>{
            if(playerHitBox.x < enemy.x + enemy.width && playerHitBox.x + playerHitBox.width > enemy.x && playerHitBox.y < enemy.y + enemy.height && playerHitBox.height + playerHitBox.y > enemy.y){
                result = true
            }
        })
        return result
    }

    onPlatform() {
        let type = null
        let playerHitBox = {x:this.x+15, y:this.y, width:this.width-30, height:this.height}

        this.game.platforms.forEach((platform)=>{

            const X_test = (playerHitBox.x > platform.x && playerHitBox.x < platform.x+platform.width)  || (playerHitBox.x+playerHitBox.width > platform.x && playerHitBox.x+playerHitBox.width < platform.x+platform.width)
            const Y_test = (platform.y - (playerHitBox.y+playerHitBox.height) <= 0) && (platform.y - (playerHitBox.y+playerHitBox.height) >= -platform.height)

            if(X_test && Y_test) {
                type = platform.type
            }
        })
      
        return type
    }
}