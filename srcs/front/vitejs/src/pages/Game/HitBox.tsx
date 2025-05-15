import { ReactNode } from "react"
import ThreePlayers from "./hitboxes/ThreePlayers"

export default function HitBox({ players, children }: { players: number, children: ReactNode }) {
    return (
        <div className="block relative w-full h-full">
            {/* {players == 3 && <ThreePlayers>{children}</ThreePlayers>} */}
            {children}
        </div>
    )
}