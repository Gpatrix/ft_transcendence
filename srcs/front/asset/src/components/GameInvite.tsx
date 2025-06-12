import { Link } from "react-router"
import Button from "./Button"
import { gpt } from "../translations/pages_reponses"
import { useEffect, useState } from "react"

interface GameInviteProps {
    link: string
    username: string;
}

type RoomType = {
    tournamentId : number,
    gameId : number,
}

export default function GameInvite({link, username}: GameInviteProps) {
    const [room, setRoom] = useState<RoomType | null>(null);

    useEffect(()=> {
        const splitted = link.substr(7).replaceAll("*","").split("/")
        const id = splitted[splitted.length - 1]
        // alert(`ID: ${id}`)
        setRoom(id)
    }, [link])

    return (
        room ? (
        <Link to={`/lobby/friendLoby/waiting-room/${room}/${room}`} className="text-yellow border-l-dark-yellow">
            <p className="font-title mb-4 mt-4">{username} {gpt("invited_you")}</p>
            <Button type="stroke" className="w-full font-bold font-title hover:bg-yellow hover:text-grey" >
                Play
            </Button>
        </Link>
        ) : null
    )
}