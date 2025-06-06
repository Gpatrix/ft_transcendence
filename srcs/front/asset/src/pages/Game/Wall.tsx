interface WallProps {
    id : string
    angle? : number
    left? : number
    right? : number
    bottom? : string
    top? : number
    height? : number
    width? : number
}

export default function Wall({id, angle, left, right, bottom, height, width, top} : WallProps) {
    return (
            <span id={id} className={`absolute block w-[1px] h-full`}
            style={{
                rotate: angle !== undefined ? `${90 + angle}deg` : undefined,
                left: left !== undefined ? `${left}%` : undefined,
                right: right !== undefined ? `${right}%` : undefined,
                bottom: bottom !== undefined ? `${bottom}px` : undefined,
                top: top !== undefined ? `${top}px` : undefined,
                height: height !== undefined ? `${height}px` : undefined,
                width: width !== undefined ? `${width}px` : undefined,
                transformOrigin: "left"
            }}
            >
                <span className="wall block w-full h-full rounded-2xl bg-yellow">
                </span>
            </span>
    )
}