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
    previousPosition: pos = {x: 0, y: 0}; // Nouvelle propriété pour stocker la position précédente

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
            // Vérifions uniquement si la balle est près d'une raquette (gauche ou droite)
            if (this.position.x > this.mapDimensions.x / 3 
                && this.position.x < this.mapDimensions.x /3 * 2) // calculate only if on left / right
                return;
                
            const ballLeft = this.position.x;
            const ballRight = this.position.x + (this.radius * 2);
            const ballTop = this.position.y;
            const ballBottom = this.position.y + (this.radius * 2);
        
            const racketLeft = racket.pos.x;
            const racketRight = racket.pos.x + racket.properties.width;
            const racketTop = racket.pos.y;
            const racketBottom = racket.pos.y + racket.properties.height;
            const racketCenterY = (racketTop + racketBottom) / 2;
            
            // Détection de collision améliorée avec vérification de la trajectoire
            const isVerticalY = ballBottom > racketTop && ballTop < racketBottom;
            
            // Déterminer si la balle est du côté gauche ou droit
            const isLeftSide = this.position.x < (this.mapDimensions.x / 2);
            
            // Vérifier la collision basée sur la position et la trajectoire
            let isCollision = false;
            
            if (isLeftSide) {
                // Raquette gauche
                isCollision = isVerticalY && 
                    (ballRight >= racketLeft && ballLeft <= racketRight) && 
                    this.velocity.x < 0;
            } else {
                // Raquette droite
                isCollision = isVerticalY && 
                    (ballRight >= racketLeft && ballLeft <= racketRight) && 
                    this.velocity.x > 0;
                    
                // Vérification supplémentaire pour les mouvements rapides
                if (!isCollision && isVerticalY && this.velocity.x > 5) {
                    // Vérifier si la balle a "sauté" la raquette entre deux frames
                    const prevBallLeft = this.previousPosition.x;
                    const prevBallRight = this.previousPosition.x + (this.radius * 2);
                    
                    if (prevBallLeft < racketLeft && ballRight > racketRight) {
                        isCollision = true;
                        // Repositionner la balle devant la raquette
                        this.position.x = racketLeft - (this.radius * 2) - 1;
                    }
                }
            }

            if (isCollision) {
                // Calculer l'effet de l'impact basé sur où la balle a touché la raquette
                const relativeImpactY = (this.position.y + this.radius - racketCenterY) / (racket.properties.height / 2);
                
                // Modifier la vitesse y en fonction de l'impact (effet)
                this.velocity.y = relativeImpactY * 5;
                
                // Inverser la direction x et augmenter légèrement la vitesse
                this.velocity.x *= -1.1;
                
                // Limiter la vitesse maximale pour éviter le tunneling
                const maxSpeed = 12;
                if (Math.abs(this.velocity.x) > maxSpeed) {
                    this.velocity.x = maxSpeed * Math.sign(this.velocity.x);
                }
                
                // Marquer la raquette comme dernier toucheur
                this.lastToucher = isLeftSide ? 0 : 1;
                
                return;
            }
        });
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
            // Sauvegarder la position précédente avant de la mettre à jour
            this.previousPosition = { x: this.position.x, y: this.position.y };
            
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.processWallCollision();
        }
    }

    unFreeze() {
        this.isFreezed = false;
    }

    resetPos() {
        this.isFreezed = true;
        this.position.x = (this.mapDimensions.x / 2) - this.radius;
        this.position.y = (this.mapDimensions.y / 2) - this.radius;
        this.previousPosition = { x: this.position.x, y: this.position.y }; // Réinitialiser la position précédente également
        this.velocity.x = Math.random() > 0.5 ? 5 : -5;
        this.velocity.y = Math.random() > 0.5 ? -3 : -1;
    }
}