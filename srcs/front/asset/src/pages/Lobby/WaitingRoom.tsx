import { useEffect } from "react"
import { useNavigate, useParams } from "react-router";
import { get_server_translation } from "../../translations/server_responses";

export default function WaitingRoom() {
    const navigate = useNavigate()

    const { gameId, tournamentId } = useParams();


    const wsHandler = () => {
        let ws : WebSocket = new WebSocket(`wss://${window.location.host}/api/game/join/${gameId}/${tournamentId}`);

        ws.onopen = () => {
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const json =JSON.parse(event.data)
            if (json.error) {
                console.log(json)
                ws.close()
                navigate(`/404-error?gameNotFound`)
            }
            if (json.message && json.message == "gameLaunched") {
                ws.close()
                navigate(`/play/multi?tournament=${json.tournamentId}&game=${json.gameId}`)
            }
        }

        ws.onclose = () => {
        }
    }

    useEffect(()=>{
        wsHandler()
    }, [])


    return (
        <div className="flex w-full h-full flex-col justify-center items-center">
            <h2 className="text-yellow font-title animate-bounce">Waiting for players...</h2>
            <img className="mt-15 animate-spin" src="/icons/wait.png" />
        </div>
    )
}