import { Link } from "react-router"
import Button from "./Button"

interface GameInviteProps {
    link: string
    username: string;
}
export default function GameInvite({link, username}: GameInviteProps) {
    console.log("LINK:", link)
    return (
        <Link to={link.substr(7)} className="text-yellow border-l-dark-yellow">
            <p className="font-bold">{username} invited you !</p>
            <Button type="full" className="w-[300px]" >
                Play
            </Button>
        </Link>
    )
}