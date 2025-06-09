import { useEffect } from "react"
import Header from "../../components/Header"
import { useNavigate, useSearchParams } from "react-router"

export default function FriendsLobby() {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    async function joinGame() {
        if (params.get("gameId"))
            alert("gameID")
        else {
            navigate("/lobby/friends/create")
        }
    }

    useEffect(()=> {
        joinGame()
    }, [params])

    return (
        <div>

        </div>
    )
}