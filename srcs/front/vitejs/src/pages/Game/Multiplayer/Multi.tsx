import { useEffect, useState, useRef } from "react";
import { redirect, useNavigate, useSearchParams } from "react-router";
import MultiGame from "./MultiGame";
import { mapDimension } from "./MultiGame";
import StartCounterMulti from "./StartCounterMulti";
import { Ball } from "./Classes/Ball";
import MultiPointsCounter from "./MultiPointsCounter";
import Disconnected from "./Popups/Disconnected";

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
    const [points, setPoints] = useState<Array<number>>([])

    const ball = useRef<Ball>(new Ball({x:0, y:0}, {x:0, y:0}, 10, mapDimension));
    const navigate = useNavigate()

    const [params] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    const [disconnect, setDisconnect] = useState<boolean>(false)

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

            switch (json.message) {
                case "playerJoined": 
                    setPlayers(json.players)     
                    break
                case "start":
                    console.log("START")
                    ball.current.unFreeze(  )
                    setPlayers(json.players)
                    setCounter("3")
                    break    
                case "update" :
                    setPlayers(json.players)
                    break
                case "ball":
                    console.log(json.ball)
                    ball.current.velocity = json.ball.velocity;
                    ball.current.position = json.ball.position;
                    break 
                case "result":
                    setPoints(json.result[0])
                    break
                case "freeze":
                    ball.current.freeze()
                    setDisconnect(true)
                    break
                case "unfreeze":
                    ball.current.unFreeze()
                    setDisconnect(false)
                    break
            }

        };

        ws.onclose = (event) => {
            setError(event.code)
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
            {error && <p className="text-yellow">{error}</p>}
            {disconnect && <Disconnected/>}
            {!error &&
            <span>
                <MultiGame ball={ball.current} players={players} socket={socket.current} />
                {counter && <StartCounterMulti width={mapDimension.x} height={mapDimension.y} counter={counter} setCounter={setCounter}/>}
                <MultiPointsCounter points={points}/>
            </span>
            }
        </div>
    );
}
