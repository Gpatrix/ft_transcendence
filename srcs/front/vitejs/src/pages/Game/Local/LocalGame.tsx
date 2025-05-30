import { useEffect, useRef, useState } from "react";
import { Ball } from "./LocalBall.tsx";
import BallComponent from "../Ball/Ball";
import { Racket } from "../Racket";
import RacketComponent from "../Racket";
import Wall from "../Wall";
import { pos, dimension } from "./LocalBall.tsx"
import StartCounter from "./StartCounter.tsx";
import PointsCounter from "./PointsCounter.tsx";
import { gpt } from "../../../translations/pages_reponses.tsx";
import IA from "../../../classes/IA.tsx";

const defaultPos : pos = {
    x : 250,
    y : 150
}

const defaultVelocity : pos = {
    x: 450,
    y: 460
}

const mapDimension : dimension = {
    x : 700,
    y : 500
}
export default function Game() {
    const isBot = true;

    const pressedKeys = useRef(new Set<string>());
    const ball = useRef<Ball>(new Ball(defaultPos, defaultVelocity, 10, mapDimension));
    const ia = useRef<IA | null>(null);
    const rackets = useRef<Racket[] | null>(null);    
    const [players, setPlayers] = useState([0, 0]);
    // const [, setTicks] = useState<number>(0);
    const [counter, setCounter] = useState<string | null>(gpt("press_space_to_play"));

    function updateResult(result : number) {
        setPlayers(prev => {
            const updated = [...prev];
            updated[result]++;
            return updated;
        });
    }

    useEffect(() => {
        const r1 = new Racket({ id: 1, keyUp: "w", keyDown: "s", speed: 350 });
        const r2 = new Racket({ id: 2, keyUp: isBot ? "BOT_UP" : "ArrowUp", keyDown: isBot ? "BOT_DOWN" : "ArrowDown", speed: 350 });
        rackets.current = [r1, r2];
    
        ia.current = new IA(r2, ball.current, pressedKeys.current, mapDimension);

        const handleKeyDown = (e: KeyboardEvent) => pressedKeys.current.add(e.key);
        const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.key);
        const handleUnfreeze = (e: KeyboardEvent) => {
            if (e.key == ' ') {
                setCounter("3")
                setTimeout(()=>{
                    setCounter(null);
                    ball.current.unFreeze();
                    window.removeEventListener("keydown", handleUnfreeze);
                }, 3000)
            }
        };
        console.log('re redner')

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleUnfreeze);

        let animationFrameId: number;
        ball.current.resetPos();
        setTimeout(() => {
            ia.current?.refreshView(r1, ball.current);
        }, 1000);
        let lastTime = performance.now();
        
        const loop = (now: any) => {
            const deltaTime = (now - lastTime) / 1000; // In seconds
            lastTime = performance.now();

            rackets.current.forEach(r => r.update(pressedKeys.current, deltaTime));
            ball.current.nextPos(deltaTime);
            ball.current.checkRacketCollision(rackets.current);
            const result = ball.current.checkVerticalCollision();

            if (result != -1) {
                updateResult(result);
                ball.current.resetPos();
                setTimeout(()=>{
                    ball.current.unFreeze();
                }, 500)
            }
            // setTicks((t)=> t+1);
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.addEventListener("keydown", handleUnfreeze);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="block ml-auto mr-auto w-fit h-fit ">
            <span className="block relative" style={{ width: `${mapDimension.x}px`, height: `${mapDimension.y}px` }}>

                    <RacketComponent id={1} left={5} />
                    <RacketComponent id={2} right={5} />
                {counter && <StartCounter width={mapDimension.x} height={mapDimension.y} setCounter={setCounter} counter={counter} /> }

                <Wall id="top"    width={mapDimension.x} height={5} top={0} />
                <Wall id="bottom" width={mapDimension.x} height={5} bottom={`${0}`} />

                <Wall id="left"  height={mapDimension.y} width={5} bottom={`${0}`} />
                <Wall id="right" height={mapDimension.y} width={5} bottom={`${0}`} right={0}/>

                <BallComponent ball={ball.current} />
                <PointsCounter points={players}/>
            </span>
        </div>
    );
}
