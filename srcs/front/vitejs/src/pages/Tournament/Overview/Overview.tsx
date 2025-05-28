import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Pair from "./Brackets/Pair"
import Column from "./Brackets/Column"


export default function Overview() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const [placedPlayers, setPlacedPlayers] = useState<Array<Array<string>>>([]) 
    // const [players, setPlayers] = useState<>

    useEffect(()=> {
        const players = params.get("players")
    
        if (!players) {
            navigate("/404-error")
            return ;
        }
        const json = JSON.parse(atob(players))
        setPlacedPlayers(json)
        console.log("PLACEDPLAYERS: ", json)
    }, [])



    return (
        <div className="flex">
            {
                placedPlayers.map((column, i)=>{
                    return (
                        <Column key={i} players={column} />
                    )
                })
            }

            {/* <span className="flex flex-col gap-[40px] justify-around mx-[40px]">
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
            </span>
            <span className="flex flex-col gap-4 justify-around mx-[40px]">
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
            </span>
            <span className="flex flex-col gap-4 justify-around mx-[40px]">
                <Pair top="user1" bottom="user2"/>
                <Pair top="user1" bottom="user2"/>
            </span>
            <span className="flex flex-col gap-4 justify-around mx-[40px]">
                <Pair top="user1" bottom="user2"/>
            </span> */}
        </div>
    )
}