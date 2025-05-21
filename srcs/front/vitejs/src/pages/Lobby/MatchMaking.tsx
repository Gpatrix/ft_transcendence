import { useEffect } from "react"
import { useState } from "react";

export default function MatchMaking() {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const wsHandler = () => {
        const ws = new WebSocket('wss://localhost/api/game/matchmaking');

        ws.onopen = () => {
            setSocket(ws);
            console.log("opened")
        };

        ws.onmessage = (event) => {
            console.log(event)
        }

        ws.onclose = () => {
            console.log("closed!!!")
        }
    }

    useEffect(()=>{
        wsHandler()
    }, [])


    return (
        <div>
            test
        </div>
    )
}