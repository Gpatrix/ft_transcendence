import { useAuth } from "../../../AuthProvider";
import { gpt } from "../../../translations/pages_reponses";
import { useWebSocket } from "../../Auth/WebSocketComponent";

export default function LogoutButton() {
    const auth = useAuth()

    const { socket } = useWebSocket();
    

    return (
            <a onClick={()=>auth.logout(socket)} 
            className="block w-1/2 border-1 text-center border-yellow px-3 py-2 rounded-md mt-7 cursor-pointer"
            >
                {gpt("logout")}
            </a>
    )
}