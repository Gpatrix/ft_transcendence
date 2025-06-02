import { useEffect } from "react"
import { useState } from "react";
import { useNavigate } from "react-router";

export default function MatchMaking() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const wsHandler = () => {
        let ws : WebSocket = new WebSocket('wss://localhost:3000/api/game/matchmaking');

        ws.onopen = () => {
            setSocket(ws);
            console.log("opened")
        };

        ws.onmessage = (event) => {
            const json =JSON.parse(event.data)
            if (json.message && json.message == "gameLaunched") {
                ws.close()
                navigate(`/play/multi?tournament=${json.tournamentId}&game=${json.gameId}`)
            }
        }

        ws.onclose = () => {
            console.log("closed!!!")
        }
    }

    useEffect(()=>{
        wsHandler()
    }, [])


    return (
        <div className="flex w-full h-full flex-col justify-center items-center">
            <h2 className="text-yellow font-title animate-bounce">Matchmaking...</h2>
            <img className="mt-15 animate-spin" src="/icons/wait.png"></img>
        </div>
    )
}