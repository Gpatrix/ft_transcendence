import Wall from "../Wall"
import { Ball, dimension } from "../Local/LocalBall"
import { useEffect, useState, useRef } from "react"
import Multi, { Player } from "./Multi"
import MultiPlayerRacket from "./OthersRacket"
import RacketComponent from "../Racket"
import { Racket } from "../Racket"
import MultiBallComponent from "./MultiBall"
import MultiPointsCounter from "./MultiPointsCounter"

export const mapDimension: dimension = {
  x: 700,
  y: 500
}

export const racketDimentions : dimension = {
  x : 10,
  y: 70
}

interface MultiGameProps {
  players: Player[]
  socket: WebSocket |null
  ball: Ball
}

export default function MultiGame({ players, socket, ball }: MultiGameProps) {
    const pressedKeys = useRef(new Set<string>())
  
    const [localY, setLocalY] = useState<number>(0)
  
    const [, setTicks] = useState<number>(0)

  
    useEffect(() => {
        if (!socket) return;
        const handleKeyDown = (e: KeyboardEvent) => {
        let direction: 'up' | 'down' | null = null;
    
        if (e.key === 'ArrowUp' || e.key === 'w')
            direction = 'up';
        else if (e.key === 'ArrowDown' || e.key === 's')
            direction = 'down';
    
        if (!direction) return;
        pressedKeys.current.add(direction);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'w') {
            pressedKeys.current.delete('up');
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            pressedKeys.current.delete('down');
        }
    };
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);


      let animationFrameId: number;
      let lastTime = performance.now();

      const loop = (now: any) => {
        const deltaTime = (now - lastTime) / 1000; // In seconds
        lastTime = performance.now();


        setLocalY((prev) => {
            let newY = prev;
            const speed = 10
    
            if (pressedKeys.current.has("up")) {
              if (newY - speed >= 0) {
                socket.send(JSON.stringify({ action: "up" }));
                newY += speed;
              }
            }
            if (pressedKeys.current.has("down")) {
              if (newY + racketDimentions.y + speed <= mapDimension.y) {
                  socket.send(JSON.stringify({ action: "down" }));
                  newY += speed
              }
            }
            // ball.checkVerticalCollision()
            // ball.nextPos(deltaTime)
            return (newY)
        });
        // ball.nextPos()

        animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);


      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };

    }, [socket]);

    useEffect(() => {
        const you = players.find(p => p.isYours);
        if (!you) return;
        setLocalY(you.position.y);
    }, [players]);

  return (
    <div className="block ml-auto mr-auto w-fit h-fit">
      <span className="border-yellow border-2 block relative" style={{ width: `${mapDimension.x}px`, height: `${mapDimension.y}px` }}>
        {players.map((player, index) => {
            const isYou = player.isYours;
            return <MultiPlayerRacket localY={isYou ? localY : null} key={index} player={player} />
        })}
        <MultiBallComponent ball={ball} />
      </span>
    </div>
  )
}
