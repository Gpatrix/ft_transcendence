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

export class Racket {
    element: HTMLElement
    y = 0
    speed: number
    keyUp: string
    keyDown: string
    limits : {
        top : number
        bottom : number
    }

    constructor({ id, keyUp, keyDown, speed }: RacketArgs) {
        const el = document.getElementById(String(id))
        if (!el) 
            throw "Element not found"
        this.element = el
        this.keyUp = keyUp
        this.keyDown = keyDown
        this.speed = speed

        const top_element = document.getElementById("top")?.getBoundingClientRect()
        const bottom_element = document.getElementById("bottom")?.getBoundingClientRect()
        if (!top_element || !bottom_element)
            throw "ERROR";
        this.limits = {
            top: top_element.y + top_element.height,
            bottom: bottom_element.y
        }
    }

    checkCollsions(direction : number) : boolean {
        const rect = this.element.getBoundingClientRect()

        if (direction == Direction.UP)
            return (rect.y >= this.limits.top)
        return ( rect.y + rect.height <= this.limits.bottom)
    }

    update(pressedKeys: Set<string>) {
        if (pressedKeys.has(this.keyUp)) {
            if (this.checkCollsions(Direction.UP))
                this.y -= this.speed
        }
        if (pressedKeys.has(this.keyDown)) {
            if (this.checkCollsions(Direction.DOWN))
                this.y += this.speed
        }
        this.element.style.transform = `translateY(${this.y}px)`
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
            id={String(id)}
            style={{
                left: left !== undefined ? `${left}%` : undefined,
                right: right !== undefined ? `${right}%` : undefined,
                bottom: bottom !== undefined ? `${bottom}%` : undefined,
                rotate: angle !== undefined ? `${90 + angle}deg` : undefined
            }}
            className={`
                absolute
                block w-[1%] h-[10%]
                bg-yellow
                rounded-full
            `}
        ></span>
    )
}