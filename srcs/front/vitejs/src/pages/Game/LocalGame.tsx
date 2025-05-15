import { useEffect, useRef, useState } from "react";
import { Ball } from "./Ball/LocalBall";
import BallComponent from "./Ball/Ball";
import { Racket } from "./Racket";
import RacketComponent from "./Racket";
import HitBox from "./HitBox";
import Wall from "./Wall";
import { pos, dimension } from "./Ball/LocalBall"


const defaultPos : pos = {
    x : 250,
    y : 150
}

const defaultVelocity : pos = {
    x: 4.5,
    y: 4.6
}

const mapDimension : dimension = {
    x : 700,
    y : 300
}

export default function Game() {
    const pressedKeys = useRef(new Set<string>());
    const rackets = useRef<Racket[]>([]);
    const ball = useRef<Ball>(new Ball(defaultPos, defaultVelocity, 10, mapDimension));
    const [, setTicks] = useState<number>(0)

    useEffect(() => {
        const r1 = new Racket({ id: 1, keyUp: "w", keyDown: "s", speed: 4 });
        const r2 = new Racket({ id: 2, keyUp: "ArrowUp", keyDown: "ArrowDown", speed: 4 });
        rackets.current = [r1, r2];

        const handleKeyDown = (e: KeyboardEvent) => pressedKeys.current.add(e.key);
        const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.key);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        let animationFrameId: number;
        ball.current.unFreeze()

        const loop = () => {
            rackets.current.forEach(r => r.update(pressedKeys.current));
            ball.current.nextPos();

            setTicks((t)=> t+1)
            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="block ml-auto mr-auto w-fit h-fit">
            <span className="block relative" style={{ width: `${mapDimension.x}px`, height: `${mapDimension.y}px` }}>
                <HitBox players={2}>
                    <RacketComponent bottom={5} id={1} left={2} />
                    <RacketComponent bottom={5} id={2} right={2} />
                </HitBox>

                <Wall id="left"   height={mapDimension.y} bottom={"0px"} />
                <Wall id="right"  height={mapDimension.y} bottom={"0px"} right={0} />
                <Wall id="top"    height={mapDimension.x} angle={0} left={50} bottom={"-17%"} />
                <Wall id="bottom" height={mapDimension.x} left={50} angle={0} bottom={"-116%"} />


                <BallComponent ball={ball.current} />
            </span>
        </div>
    );
}
