import { properties, velocity, dimension, pos, Player } from "./PongGame";


export class Ball {
    constructor (properties : properties) {
        const initPos = {
            x: properties.size.width / 2,
            y: properties.size.height / 2
        }
        this.position = initPos;
        this.velocity = {x:0 , y:0};
        this.radius = 10;
        this.mapDimensions = {
            x: properties.size.width,
            y: properties.size.height,
        }
    }
    position: pos;
    velocity: velocity;
    radius: number;
    isFreezed: boolean = true;
    lastToucher: number = -1;
    mapDimensions: dimension
    previousPosition: pos = {x: 0, y: 0};

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

    checkRacketCollision(rackets: Array<Player>) {
        if (this.position.x > this.mapDimensions.x / 3 
            && this.position.x < this.mapDimensions.x /3 * 2)
            return;

        rackets.forEach((racket)=>{
            const ballLeft = this.position.x;
            const ballRight = this.position.x + (this.radius * 2);
            const ballTop = this.position.y;
            const ballBottom = this.position.y + (this.radius * 2);

            const racketLeft = racket.position.x;
            const racketRight = racket.position.x + racket.properties.width;
            const racketTop = racket.position.y;
            const racketBottom = racket.position.y + racket.properties.height;
            const racketCenterY = (racketTop + racketBottom) / 2;

            const isVerticalY = ballBottom > racketTop && ballTop < racketBottom;
            
            const isLeftSide = this.position.x < (this.mapDimensions.x / 2);
            
            let isCollision = false;

            if (isLeftSide) {
                isCollision = isVerticalY && 
                    (ballRight >= racketLeft && ballLeft <= racketRight) && 
                    this.velocity.x < 0;
            } else {
                isCollision = isVerticalY && 
                    (ballRight >= racketLeft && ballLeft <= racketRight) && 
                    this.velocity.x > 0;
                    
                if (!isCollision && isVerticalY && this.velocity.x > 5) {
                    const prevBallLeft = this.previousPosition.x;
                    const prevBallRight = this.previousPosition.x + (this.radius * 2);
                    
                    if (prevBallLeft < racketLeft && ballRight > racketRight) {
                        isCollision = true;
                        this.position.x = racketLeft - (this.radius * 2) - 1;
                    }
                }
            }
            if (isCollision) {
                const relativeImpactY = (this.position.y + this.radius - racketCenterY) / (racket.properties.height / 2);
                
                this.velocity.y = relativeImpactY * 5;
                
                this.velocity.x *= -1.1;
                
                const maxSpeed = 10;
                if (Math.abs(this.velocity.x) > maxSpeed) {
                    this.velocity.x = maxSpeed * Math.sign(this.velocity.x);
                }
                this.lastToucher = isLeftSide ? 0 : 1;
                return;
            }
        })
    }


    
    checkVerticalCollision() : number { 
        if (this.position.x <= 0)  {
            return (0); // left
        }
        if ((this.position.x + this.radius * 2)  >= this.mapDimensions.x) {
            return (1); // right
        }
        return (-1)
    }

    nextPos() {
        if (!this.isFreezed)
        {
            this.previousPosition = { x: this.position.x, y: this.position.y };
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.processWallCollision();
        }
    }

    freeze() {
        this.isFreezed = true;
    }

    unFreeze() {
        this.isFreezed = false;
    }

    resetPos() {
        this.isFreezed = true;
        this.position.x = (this.mapDimensions.x / 2) - this.radius;
        this.position.y = (this.mapDimensions.y / 2) - this.radius;
        this.previousPosition = { x: this.position.x, y: this.position.y };
        this.velocity.x = Math.random() > 0.5 ? 5 : -5;
        this.velocity.y = Math.random() > 0.5 ? -3 : -1;
    }
}