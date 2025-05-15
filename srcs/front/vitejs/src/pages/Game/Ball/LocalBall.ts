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
                    mapDimensions: dimension
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