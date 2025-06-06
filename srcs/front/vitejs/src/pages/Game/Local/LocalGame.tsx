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
import { useSearchParams } from "react-router";
import WinPopUp from "./WinPopup.tsx";

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

interface GameProps {
    userNames : Array<string> | null
}

export default function Game({userNames}: GameProps) {
    const pressedKeys = useRef(new Set<string>());
    const ball = useRef<Ball>(new Ball(defaultPos, defaultVelocity, 10, mapDimension));
    const ia = useRef<IA | null>(null);
    const rackets = useRef<Racket[] | null>(null);    
    const [players, setPlayers] = useState([0, 0]);
    const [params] = useSearchParams()
    const [counter, setCounter] = useState<string | null>(gpt("press_space_to_play"));
    // const [userNames, setUserNames] = useState<Array<string> | null>(null)
    const [winPopup, setWinPopup] = useState<boolean>(false)

    function updateResult(result : number) {
        setPlayers(prev => {
            const updated = [...prev];
            updated[result] += 1;

            if (updated[result] >= 10) {
                setWinPopup(true);
            }
        
            return updated;
        }); 
    }



    useEffect(() => {
        const isBot = params.get("isBot") === "1";
        
        const r1 = new Racket({ id: 1, keyUp: "w", keyDown: "s", speed: 500 });
        const r2 = new Racket({ id: 2, keyUp: isBot ? "BOT_UP" : "ArrowUp", keyDown: isBot ? "BOT_DOWN" : "ArrowDown", speed: 500 });
        rackets.current = [r1, r2];
    
        ia.current = new IA(r2, pressedKeys.current, mapDimension);

        const normalizeKey = (key: string): string => {
            switch (key) {
              case "ArrowUp":
              case "ArrowDown":
              case "ArrowLeft":
              case "ArrowRight":
              case " ":
              case "BOT_UP":
              case "BOT_DOWN":
                return key;
              default:
                return key.toLowerCase();
            }
          };
          

        const handleKeyDown = (e: KeyboardEvent) => pressedKeys.current.add (normalizeKey(e.key));
        const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(normalizeKey(e.key));
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

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleUnfreeze);

        let animationFrameId: number;
        ball.current.resetPos();
        setInterval(() => {
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
                <RacketComponent id={1}  left={10} />
                <RacketComponent id={2} right={10} />
                {counter && <StartCounter width={mapDimension.x} height={mapDimension.y} setCounter={setCounter} counter={counter} /> }

                <Wall id="top"    width={mapDimension.x} height={5} top={0} />
                <Wall id="bottom" width={mapDimension.x} height={5} bottom={`${0}`} />

                <Wall id="left"  height={mapDimension.y} width={5} bottom={`${0}`} />
                <Wall id="right" height={mapDimension.y} width={5} bottom={`${0}`} right={0}/>

                {!winPopup && <BallComponent ball={ball.current} />}
                {!winPopup && <PointsCounter points={players}/>}
                {winPopup && <WinPopUp userNames={userNames} scores={players}/>}
            </span>
        </div>
    );
}
