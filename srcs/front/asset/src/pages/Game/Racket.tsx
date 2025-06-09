import { pos } from "./Local/LocalBall.tsx"

type RacketArgs = {
    id: number
    keyUp: string
    keyDown: string
    speed: number
}

enum Direction {
    UP = 0,
    DOWN = 1
}

type RacketProperties = {
    speed: number
    margin : number,
    height: number,
    width: number,
    limits : {
        top : number
        bottom : number
    }
}

export class Racket {
    element: HTMLElement;
    pos : pos;
    keyUp: string;
    keyDown: string;
    properties : RacketProperties;
    isFreezed: boolean = false;
    constructor({ id, keyUp, keyDown, speed }: RacketArgs) {
        const el = document.getElementById(`racket-${id}`)
        const rect = el?.getBoundingClientRect()
        const top_element = document.getElementById("top")?.getBoundingClientRect()
        const bottom_element = document.getElementById("bottom")?.getBoundingClientRect()
        const left_element  = document.getElementById("left")?.getBoundingClientRect()

        if (!top_element || !bottom_element || !left_element || !el || !rect)
            throw "ERROR";


        this.element = el
        this.keyUp = keyUp
        this.keyDown = keyDown
        this.pos = {
            x: rect.x - (left_element.x + left_element.width),
            y: 0
        }
        this.properties = {
            speed : speed,
            margin : rect.width / 2,
            height : rect.height,
            width : rect.width,
            limits : {
                top: 0,
                bottom: bottom_element.top
            }
        }

    }

    checkCollisions(direction: Direction, deltaTime: number): boolean {
        const dy = this.properties.speed * deltaTime;
    
        if (direction === Direction.UP)
            return (this.pos.y - dy >= 0)
        return (this.pos.y + dy <= 400  )
    }
    

    update(pressedKeys: Set<string>, deltaTime: number) {
        if (this.isFreezed == true)
            return ;
        if (pressedKeys.has(this.keyUp)) {
            if (this.checkCollisions(Direction.UP, deltaTime))
                this.pos.y -= this.properties.speed * deltaTime;
        }
        if (pressedKeys.has(this.keyDown)) {
            if (this.checkCollisions(Direction.DOWN, deltaTime))
                this.pos.y += this.properties.speed * deltaTime;
        }
        this.element.style.transform = `translateY(${this.pos.y}px)`
    }   
}

interface RacketComponentProps {
    id: number
    left?: number
    right?: number
    bottom?: number
    angle?: number
}

export default function RacketComponent({ id, left, right, bottom, angle }: RacketComponentProps) {
    return (
        <span
            id={`racket-${id}`}
            style={{
                left: left !== undefined ? `${left}px` : undefined,
                right: right !== undefined ? `${right}px` : undefined,
                bottom: bottom !== undefined ? `${bottom}%` : undefined,
                rotate: angle !== undefined ? `${90 + angle}deg` : undefined
            }}
            className={`
                absolute
                block w-[1%] h-[20%]
                bg-yellow
                
            `}
        ></span>
    )
}