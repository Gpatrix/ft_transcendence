
import { Player } from "./Multi"

interface MultiPlayerRacketProps {
  player: Player
  localY : number | null
}

export default function MultiPlayerRacket({player, localY}: MultiPlayerRacketProps) {
    return (
        <span id={player.isYours ? "playerRacket" : ""} className="block ease-in-out absolute h-[70px] w-[10px] bg-yellow"
              style={{
                top: `${localY ? localY : player.position.y}px`,
                left: `${player.position.x}px`,
                backgroundColor: "yellow",
                boxShadow: player.isYours ? "0px 0px 10px 5px rgba(254,255,0,0.59)" : "none"
              }}  
        ></span>
    )
}