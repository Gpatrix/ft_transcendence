import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { dimension } from "../Local/LocalBall";
import MultiGame from "./MultiGame";
import StartCounter from "../Local/StartCounter";
import { mapDimension } from "./MultiGame";
import StartCounterMulti from "./StartCounterMulti";


export type Player = {
    id: number
    score : number
    position: {
        x: number
        y: number
    },
    isYours: boolean
}


export default function Multi() {
    const socket = useRef<WebSocket | null>(null)
    
    const [players, setPlayers] = useState<Player[]>([])
    const [counter, setCounter] = useState<string | null>(null)

    const [params] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const tournament = params.get("tournament");
        const game = params.get("game");

        if (!game || !tournament) {
            setError("PARAMS ERROR"); // todo translations
            return;
        }

        const ws = new WebSocket(`wss://localhost/api/game/connect/${tournament}/${game}`);
        if (!ws)
            return ;
        socket.current = ws
        ws.onopen = () => {
            console.log("/api/game/connect/ opened");
        };

        ws.onmessage = (event) => {
            const json = JSON.parse(event.data)
            console.log(json)
            if (json.message == "playerJoined") { // updating players on join
                console.log("JOIN")
                setPlayers(json.players)     
                console.log(players)
            }
            if (json.message == "start") { // updating players on join, start the counter
                console.log("START")
                setPlayers(json.players)     
                setCounter("3")
            }
            if (json.message == "update") {
                setPlayers(json.players)
            }
        };

        ws.onclose = () => {
            console.log("/api/game/connect/ closed");
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            setError("WebSocket error");
        };

        return () => {
            ws.close();
        };

    }, [params]);


    return (
        <div className="relative">
            {error && <p>{error}</p>}
            <MultiGame players={players} socket={socket.current} />
            {counter && <StartCounterMulti width={mapDimension.x} height={mapDimension.y} counter={counter} setCounter={setCounter}/>}
            <button className="text-yellow"
                    onClick={()=>{
                        if (!socket.current) return;
                        socket.current.send(JSON.stringify({test: "test"}))
                    }}
            >
                test-ws
            </button>
        </div>
    );
}
