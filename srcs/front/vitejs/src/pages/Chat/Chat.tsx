import Header from "../../components/Header.tsx"
// import DropDownMenu from "../../components/DropDownMenu.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"
import RightChat from './RightChat.tsx'
import LeftChat from './LeftChat.tsx'
import PopupFriendsComponent from "./PopupFriendsComponent.tsx";
import { useAuth } from "../../AuthProvider.tsx";
// import { ProfileDataType } from "../Profile/others/OthersProfile.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileDataType } from "../Profile/me/MyProfile.tsx";
import User from "../../classes/User.tsx";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";

export default function Chat() {

    const { fetchWithAuth } = useAuth();
    const { friends, setFriends } = useWebSocket();

    const [showFriendPopup, setShowFriendPopup] = useState(false);

    // const navigate = useNavigate()

    const [profileData, setProfileData] = useState<User | undefined>()

    function getUserParams() {
        fetchWithAuth(`https://localhost/api/user/get_profile/`)
        .then((response) => response.json())
        .then((json) => {
            const data = json.data
            setProfileData(new User(0, data.name, data.email, data.profPicture, data.bio, data.lang, data.isTwoFactorEnabled, data.rank));
            return(true);
        })
        .catch((error) => {
            console.error("Error :", error);
        });
    }

    useEffect(() => {
        getUserParams();
    }, []);

    // useEffect(() => {
    //     if (socket)
    //         fetchFriends();
    // }, [socket])

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">

                <LeftChat setShowFriendPopup={setShowFriendPopup} friends={friends} setFriends={setFriends} />

                <RightChat friends={friends} setFriends={setFriends} profileData={profileData as User}/>

                {showFriendPopup && (
                    <PopupFriendsComponent friends={friends} setFriends={setFriends} onClose={setShowFriendPopup}/>
                )}

            </div>
        </div>
    )
}
