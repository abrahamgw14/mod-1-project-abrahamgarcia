export class Platform {
    constructor(game, lowerY, upperY, type) {
        this.game = game
        this.width = 90
        this.height = 15
        this.type = type
        this.x = Math.floor(Math.random() * ((this.game.width-this.width) - 0 + 1)) + 0
        this.y = this.calc_Y(upperY,lowerY)
        this.vx = (this.type=='blue') ? this.game.object_vx : 0 // Para que las plataformas de tipo 'azul' se muevan 
        this.image = document.querySelector(`#${this.type}_platform`)
        this.markedForDeletion = false
    }

    update() {
        if(this.type=='blue') {
            if(this.x < 0 || this.x > this.game.width-this.width) this.vx *= -1
        }
    

        this.x += this.vx
        this.y += this.game.vy

        if(this.y >= this.game.height) {
            this.markedForDeletion = true
        }
    }

    draw(context) {
        context.drawImage(this.image,this.x,this.y,this.width,this.height)
    }


    // Utilizamos para saber la posición upperY y lowerY de la plataforma y 

    calc_Y(upperY,lowerY) {
        if(this.type != 'brown') {
            if (!this.game.platforms.length) {
                return Math.floor(Math.random() * (upperY - (upperY-100) + 1)) + (upperY-100)
            } 
            else {
                return this.game.platforms[0].y - (Math.floor(Math.random() * (this.game.platform_gap - (this.game.platform_gap-30) + 1)) + (this.game.platform_gap-30))
            }
        }
        else {
            
            let y

            do {
                y = Math.floor(Math.random() * (upperY - lowerY + 1)) + lowerY
            }
            while(this.closeToOtherPlatforms(y))
            
            return y
        }
    }

    closeToOtherPlatforms(y1) {

        for(let i = 0; i < this.game.platforms.length; i++){
            const iPlatform = this.game.platforms[i]
            const margin = 10
            if ((y1+this.height >= iPlatform.y-margin && y1+this.height <= iPlatform.y+this.height+margin) || (y1 >= iPlatform.y-margin && y1 <= iPlatform.y+this.height+margin)){
                return true
            }
        }
        return false
    }
}