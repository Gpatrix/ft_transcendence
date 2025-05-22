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

interface MultiGameProps {
  players: Player[]
  socket: WebSocket |null
}

export default function MultiGame({ players, socket }: MultiGameProps) {
  const pressedKeys = useRef(new Set<string>())

  const racket = useRef<Racket | null>(null)

  const [, setTicks] = useState<number>(0)

  useEffect(() => {
    if (!socket) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'w') {
            pressedKeys.current.add('up');
            socket.send(JSON.stringify({action: "up"}))
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            pressedKeys.current.add('down');
            socket.send(JSON.stringify({action: "down"}))
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    // window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        // window.removeEventListener('keyup', handleKeyUp);
    };
}, [socket]);


  return (
    <div className="block ml-auto mr-auto w-fit h-fit">
      <span className="block relative" style={{ width: `${mapDimension.x}px`, height: `${mapDimension.y}px` }}>
        <Wall id="top" width={mapDimension.x} height={5} top={0} />
        <Wall id="bottom" width={mapDimension.x} height={5} bottom={`${0}`} />
        <Wall id="left" height={mapDimension.y} width={5} bottom={`${0}`} />
        <Wall id="right" height={mapDimension.y} width={5} bottom={`${0}`} right={0} />

        {players.map((player, index) => {
          return <MultiPlayerRacket key={index} player={player} />
        })}
      </span>
    </div>
  )
}
