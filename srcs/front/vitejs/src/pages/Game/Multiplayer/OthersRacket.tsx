
import { Player } from "./Multi"

interface MultiPlayerRacketProps {
  player: Player
}

export default function MultiPlayerRacket({player}: MultiPlayerRacketProps) {
    return (
        <span id={player.isYours ? "playerRacket" : ""} className="block ease-linear absolute h-[60px] w-[10px] bg-yellow"
              style={{
                top: `${player.position.y}px`,
                left: `${player.position.x}px`,
                backgroundColor: player.isYours ? "red" : "green"
              }}  
        ></span>
    )
}