
import { Player } from "./Multi"

interface MultiPlayerRacketProps {
  player: Player
  localY : number | null
}

export default function MultiPlayerRacket({player, localY}: MultiPlayerRacketProps) {
    return (
        <span id={player.isYours ? "playerRacket" : ""} className="block ease-in-out absolute h-[60px] w-[10px] bg-yellow"
              style={{
                top: `${localY ? localY : player.position.y}px`,
                left: `${player.position.x}px`,
                backgroundColor: player.isYours ? "red" : "green"
              }}  
        ></span>
    )
}