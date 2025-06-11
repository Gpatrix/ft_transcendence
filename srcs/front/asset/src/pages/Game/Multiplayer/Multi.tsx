import { useEffect, useState, useRef } from "react";
import { data, Link, redirect, useNavigate, useSearchParams } from "react-router";
import MultiGame from "./MultiGame";
import { mapDimension } from "./MultiGame";
import StartCounterMulti from "./StartCounterMulti";
import { Ball } from "./Classes/Ball";
import MultiPointsCounter from "./MultiPointsCounter";
import Disconnected from "./Popups/Disconnected";
import { gpt } from "../../../translations/pages_reponses";
import EndPopup from "./Popups/EndPopup";
import { get_server_translation } from "../../../translations/server_responses";
import Button from "../../../components/Button";

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
    const socket = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const [players, setPlayers] = useState<Player[]>([]);
    const [counter, setCounter] = useState<string | null>(null);
    const [points, setPoints] = useState<Array<number>>([]);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const isPausedRef = useRef<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const ball = useRef<Ball>(new Ball({x:0, y:0}, {x:0, y:0}, 10, mapDimension));
    const navigate = useNavigate()

    const [params] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [end, setEnd] = useState<boolean>(false)
    const [disconnect, setDisconnect] = useState<boolean>(false);

    const updatePauseState = (paused: boolean) => {
        setIsPaused(paused);
        isPausedRef.current = paused;
    };

    // Fonction pour demander l'état actuel du jeu
    const requestGameState = () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({ action: "getState" }));
        }
    };

    // Fonction pour configurer les event listeners de la WebSocket
    const setupWebSocketListeners = (ws: WebSocket) => {
        ws.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
            setDisconnect(false);
            // Demander l'état actuel du jeu dès la connexion
            setTimeout(() => requestGameState(), 100);
        };

        ws.onmessage = (event) => {
            const json = JSON.parse(event.data);
            if (!json) return;
            
            console.log("Received:", json);
            
            switch (json.message) {
                case "playerJoined": 
                    setPlayers(json.players);     
                    break;
                case "start":
                    ball.current.unFreeze();
                    setPlayers(json.players);
                    setCounter("3");
                    break;
                case "update":
                    setPlayers(json.players);
                    break;
                case "ball":
                    ball.current.velocity = json.ball.velocity;
                    ball.current.position = json.ball.position;
                    break;
                case "result":
                    setPoints(json.result[0]);
                    break;
                case "freeze":
                    ball.current.freeze();
                    setDisconnect(true);
                    break;
                case "gameEnded":
                    setEnd(true);
                    break;
                case "unfreeze":
                    ball.current.unFreeze();
                    setDisconnect(false);
                    break;
                case "gameState":
                    if (json.players) setPlayers(json.players);
                    if (json.ball) {
                        ball.current.velocity = json.ball.velocity;
                        ball.current.position = json.ball.position;
                    }
                    if (json.points) setPoints(json.points);
                    if (json.isPaused !== undefined) updatePauseState(json.isPaused);
                    if (json.gameEnded) setEnd(true);
                    break;
                case "pause":
                    updatePauseState(true);
                    break;
                case "unPause":
                    updatePauseState(false);
                    break;
            }
        };

        ws.onclose = (event) => {
            console.log("WebSocket disconnected:", event.code, event.reason);
            setIsConnected(false);
            
            if (!end && event.code !== 1000) {
                setDisconnect(true);
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting to reconnect...");
                    initializeWebSocket();
                }, 3000);
            }
        };

        ws.onerror = (err: Event) => {
            console.error("WebSocket error:", err);
            setIsConnected(false);
        };
    };

    const initializeWebSocket = () => {
        const tournament = params.get("tournament");
        const game = params.get("game");

        if (!game || !tournament) {
            setError(get_server_translation("4511"));
            return;
        }

        try {
            if (socket.current) {
                socket.current.close();
            }

            const ws = new WebSocket(`wss://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/api/game/connect/${tournament}/${game}`);
            socket.current = ws;
            setupWebSocketListeners(ws);
        } catch (error) {
            console.error("Failed to create WebSocket:", error);
            setError(get_server_translation("0500"));
        }
    };

    useEffect(() => {
        const tournament = params.get("tournament");
        const game = params.get("game");

        if (!game || !tournament) {
            setError(get_server_translation("4511"));
            return;
        }

        const fetchGame = async () => {
            try {
                const response = await fetch(
                    `https://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/api/game/getGameStatus/${game}`
                );

                const data = await response.json();
                if (response.status === 200) {
                    initializeWebSocket();
                    return 0;
                } else {
                    setError(get_server_translation(data.error));
                    return 1;
                }
            } catch (error) {
                console.error("Failed to fetch game:", error);
                setError(get_server_translation("0500"));
                return 1;
            }
        };

        fetchGame();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [params]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log("Page hidden");
            } else {
                if (isConnected) {
                    requestGameState();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isConnected]);

    return (
        <div className="relative">
            {error && 
                <span className='w-[80vw] md:w-[500px] gap-8 flex flex-col text-yellow items-center'>
                    <h2>{get_server_translation(error)}</h2>
                    <Link to={"/"} className="w-full">
                        <Button type="full" className="w-full z-1000">{gpt("back_to_home")}</Button>
                    </Link>
                </span>
            }
            {disconnect && <Disconnected/>}
            {end && !error && <EndPopup array={players} points={points}/>}
            {(!error && !end) &&
            <span>
                <MultiGame 
                    ball={ball.current} 
                    players={players} 
                    socket={socket.current} 
                    isPaused={isPaused} 
                    isPausedRef={isPausedRef} 
                />
                {counter && <StartCounterMulti width={mapDimension.x} height={mapDimension.y} counter={counter} setCounter={setCounter}/>}
                <MultiPointsCounter points={points}/>
            </span>
            }
        </div>
    );
}