import Header from "../../components/Header.tsx"
import { useEffect, useState } from "react";
import RightChat from './RightChat.tsx'
import LeftChat from './LeftChat.tsx'
import PopupFriendsComponent from "./PopupFriendsComponent.tsx";
import { useAuth } from "../../AuthProvider.tsx";
import User from "../../classes/User.tsx";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";

export default function ChatPage() {

    const { fetchWithAuth } = useAuth();
    const { friends, setFriends } = useWebSocket();

    const [showFriendPopup, setShowFriendPopup] = useState(false);

    // const navigate = useNavigate()

    const [profileData, setProfileData] = useState<User | undefined>(undefined)

    function getUserParams() {
        fetchWithAuth(`/api/user/get_profile/`)
        .then((response) => response.json())
        .then((json) => {
            if (json.data)
            {
                const data = json.data
                
                setProfileData(new User(data.id, data.name, data.email, data.profPicture, data.bio, data.lang, data.isTwoFactorEnabled, data.rank));
                return(true);
            }
        })
        .catch((error) => {
            console.log("Error :", error);
        });
    }

    useEffect(() => {
        getUserParams();
    }, []);

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">

                <LeftChat setShowFriendPopup={setShowFriendPopup} friends={friends} setFriends={setFriends} />

                <RightChat friends={friends} setFriends={setFriends} profileData={profileData as User}/>

                {showFriendPopup && (
                    <PopupFriendsComponent setFriends={setFriends} onClose={setShowFriendPopup} />
                )}

            </div>
        </div>
    )
}
