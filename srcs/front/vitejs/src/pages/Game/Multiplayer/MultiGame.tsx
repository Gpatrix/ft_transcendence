import Wall from "../Wall"
import { dimension } from "../Local/LocalBall"
import { useEffect, useState, useRef } from "react"
import { Player } from "./Multi"
import MultiPlayerRacket from "./OthersRacket"
import RacketComponent from "../Racket"
import { Racket } from "../Racket"

export const mapDimension: dimension = {
  x: 700,
  y: 500
}

export const racketDimentions : dimension = {
  x : 10,
  y: 60
}

interface MultiGameProps {
  players: Player[]
  socket: WebSocket |null
}

export default function MultiGame({ players, socket }: MultiGameProps) {
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
      const loop = () => {
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
                  socket.send(JSON.stringify({ action: "down" }));
                  newY -= speed;
            }
    
            if (newY >= 0 && (newY + racketDimentions.y) < mapDimension.y)
              return newY;
            return (prev)
        });
    
        animationFrameId = requestAnimationFrame(loop);
    };
    loop()


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
        {/* <Wall  id="top" width={mapDimension.x} height={5} top={-5} />
        <Wall  id="bottom" width={mapDimension.x} height={5} bottom={'-5'} />
        <Wall  id="left" height={mapDimension.y} width={5} bottom={`${0}`} />
        <Wall  id="right" height={mapDimension.y} width={5} bottom={`${0}`} right={0} /> */}

        {players.map((player, index) => {
            const isYou = player.isYours;
            return <MultiPlayerRacket localY={isYou ? localY : null} key={index} player={player} />
        })}
      </span>
    </div>
  )
}
