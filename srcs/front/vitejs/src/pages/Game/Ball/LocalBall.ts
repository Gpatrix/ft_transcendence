import {Racket} from "../Racket"

export interface pos {
    x: number,
    y: number
}

type velocity = pos;
export type dimension = pos;


export class Ball {
    constructor (   position: pos,
                    velocity: velocity,
                    radius: number = 5,
                    mapDimensions: dimension,
                ) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.mapDimensions = mapDimensions
    }
    position: pos;
    velocity: velocity;
    radius: number;
    isFreezed: boolean = true;
    lastToucher: number = -1;
    mapDimensions: dimension

    set setVelocity(newVelocity: velocity) {
        if (newVelocity.x < 10)
            this.velocity.x = newVelocity.x;
        if (newVelocity.y < 10)
            this.velocity.y = newVelocity.y;      
    }

    set setPosition(newPosition: pos) {
        this.position = newPosition;
    }

    processWallCollision() {
        const maxX = this.mapDimensions.x - this.radius * 2;
        const maxY = this.mapDimensions.y - this.radius * 2;

        if (this.position.y <= 0 || this.position.y >= maxY) {
            this.velocity.y *= -1;
            this.position.y = Math.max(0, Math.min(this.position.y, maxY));
        }

        if (this.position.x <= 0 || this.position.x >= maxX) {
            this.velocity.x *= -1;
            this.position.x = Math.max(0, Math.min(this.position.x, maxX));
        }
    }

    checkRacketCollision(rackets: Array<Racket>) {
        rackets.forEach((racket)=> {
            if (racket.pos.x < (this.mapDimensions.x / 2)) {    // left
                if (this.position.x <= (racket.pos.x + (racket.properties.width / 2))) {
                    if (this.position.y > racket.pos.y 
                        && this.position.y < (racket.pos.y + racket.properties.height))
                        this.velocity.x *= -1
                }
            }
            else {  // right
                if (this.position.x >= (racket.pos.x - (racket.properties.width))) {
                    if (this.position.y > racket.pos.y 
                        && this.position.y < (racket.pos.y + racket.properties.height))
                        this.velocity.x *= -1
                }
            }
        })
    }
    

    nextPos() {
        if (!this.isFreezed)
        {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.processWallCollision()
        }
    }

    unFreeze() {
        this.isFreezed = false
    }

    resetPos() {
        this.position.x += 0;
        this.position.y += 0;
    }
}