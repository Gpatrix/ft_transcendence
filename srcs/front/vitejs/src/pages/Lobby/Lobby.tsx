import { useEffect } from "react"
import Header from "../../components/Header"
import { useNavigate, useSearchParams } from "react-router"

export default function Lobby() {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    async function joinGame() {
        if (params.get("gameId"))
            alert("gameID")
        else {
            fetch("https://localhost/api/game/lobby", {
                method: "POST"
            })
        }
    }

    useEffect(()=> {
        joinGame()
    }, [params])

    return (
        <div>
            <Header />
        </div>
    )
}