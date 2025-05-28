import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Pair from "./Brackets/Pair"
import Column from "./Brackets/Column"


export default function Overview() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const [placedPlayers, setPlacedPlayers] = useState<Array<Array<string>>>([]) 

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



    return (
        <div className="flex">
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