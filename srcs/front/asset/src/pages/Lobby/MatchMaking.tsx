import { useEffect } from "react"
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import { get_server_translation } from "../../translations/server_responses";

export default function MatchMaking() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null)
    const [players, setPlayers] = useState<number | null>(null)
    const navigate = useNavigate()

    const wsHandler = () => {
        console.log("PLAYERS", players)
        if (!players) return;

        let ws : WebSocket = new WebSocket(`wss://${window.location.host}/api/game/matchmaking?mode=${players}`);

        ws.onopen = () => {
            setSocket(ws);
            console.log("opened")
        };

        ws.onmessage = (event) => {
            const json =JSON.parse(event.data)
            console.log(json)
            if (json.message) {
                if (json.message == "gameLaunched") {
                    ws.close();
                    navigate(`/play/multi?tournament=${json.tournamentId}&game=${json.gameId}`)
                if (json.error) {
                    console.log(json)
                    alert(`ERROR: ${json.error}`)
                    setError(get_server_translation(json.error))
                    ws.close();
                }   
            }
         }

        }

        ws.onclose = () => {
            console.log("closed!!!")
        }

        ws.onerror = (ev) => {
            console.log("ERROR: ", ev)
        }
    }

    useEffect(()=>{
        if (players == 2 || players == 4)
            wsHandler()
    }, [players])

    return (
        <div className="flex w-full h-full flex-col justify-center items-center">
            { error && 
            <span>
                {error}
            </span>
            }

            {players ?
            <span className="flex w-full h-full flex-col justify-center items-center">
                <h2 className="text-yellow font-title animate-bounce">Matchmaking...</h2>
                <img className="mt-15 animate-spin" src="/icons/wait.png"></img>
            </span>
            :
            <span className="flex flex-col w-1/3">
                <h2 className="text-yellow font-title mb-4">Multiplayer</h2>
                <Button onClick={()=>setPlayers(2)} className="font-title mb-4 hover:bg-yellow hover:text-grey">1V1</Button>
                <Button onClick={()=>setPlayers(4)} className="font-title mb-4 hover:bg-yellow hover:text-grey">2V2</Button>
            </span>
            }
        </div>
    )
}