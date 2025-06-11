import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Column from "./Brackets/Column"
import Panel from "../Panel"
import Winner from "../Winner"


export default function Overview() {
    const navigate = useNavigate()
    const [placedPlayers, setPlacedPlayers] = useState<Array<Array<string>>>([]) 
    const [winner, setWinner] = useState<string | null>(null)

    useEffect(()=> {
        try {
            const players = localStorage.getItem("tournament")

            if (!players) {
                throw ("error");
            }
            const json = JSON.parse(atob(players))
            setPlacedPlayers(json)
        }
        catch (error) {
            navigate("/play/tournament")
            return ;
        }
    }, [])

    useEffect(()=> {
        if (!placedPlayers)
            return ;
        const cWinner = placedPlayers[placedPlayers.length - 1]
        if (!cWinner)
            return ;
        setWinner(cWinner[0])
    }, [placedPlayers])

    return (
        <div className="flex">
            {!winner ? 
                <Panel />
            :   <Winner  name={winner}/>
            }

            {
                placedPlayers.map((column, i)=>{
                    return (
                        <div className="flex" key={i}>
                            <Column  left={i > 0} right={i < placedPlayers.length - 1} players={column} />
                        </div>
                    )
                })
            }
        </div>
    )
}