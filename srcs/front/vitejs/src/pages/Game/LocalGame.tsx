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
    x : 800,
    y : 500
}

export default function Game() {
    const pressedKeys = useRef(new Set<string>());
    const rackets = useRef<Racket[]>([]);
    const ball = useRef<Ball>(new Ball(defaultPos, defaultVelocity, 10, mapDimension));
    const [, setTicks] = useState<number>(0)

    useEffect(() => {
        const r1 = new Racket({ id: 1, keyUp: "w", keyDown: "s", speed: 6 });
        const r2 = new Racket({ id: 2, keyUp: "ArrowUp", keyDown: "ArrowDown", speed: 6 });
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
            ball.current.checkRacketCollision(rackets.current)
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
        <div className="block ml-auto mr-auto w-fit h-fit ">
            <span className="block relative" style={{ width: `${mapDimension.x}px`, height: `${mapDimension.y}px` }}>
                <HitBox players={2}>
                    <RacketComponent id={1} left={2} />
                    <RacketComponent id={2} right={2} />
                </HitBox>

                <Wall id="top"    width={mapDimension.x} height={5} top={0} />
                <Wall id="bottom" width={mapDimension.x} height={5} bottom={`${0}`} />


                <Wall id="left"  height={mapDimension.y} width={5} bottom={`${0}`} />
                <Wall id="right" height={mapDimension.y} width={5} bottom={`${0}`} right={0}/>


                <BallComponent ball={ball.current} />
            </span>
        </div>
    );
}
