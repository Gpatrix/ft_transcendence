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
    element: HTMLElement
    pos : pos
    keyUp: string
    keyDown: string
    properties : RacketProperties
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
                top: top_element.y + top_element.height,
                bottom: bottom_element.y
            }
        }

    }

    checkCollsions(direction : number) : boolean {
        const rect = this.element.getBoundingClientRect()

        if (direction == Direction.UP)
            return (rect.y >= this.properties.limits.top)
        return (rect.y + rect.height <= this.properties.limits.bottom)
    }

    update(pressedKeys: Set<string>, deltaTime: number) {
        if (pressedKeys.has(this.keyUp)) {
            if (this.checkCollsions(Direction.UP))
                this.pos.y -= this.properties.speed * deltaTime;
        }
        if (pressedKeys.has(this.keyDown)) {
            if (this.checkCollsions(Direction.DOWN))
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
                left: left !== undefined ? `${left}%` : undefined,
                right: right !== undefined ? `${right}%` : undefined,
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