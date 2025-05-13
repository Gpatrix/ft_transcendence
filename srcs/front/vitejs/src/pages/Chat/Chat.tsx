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

    const [activFriend, setActivFriend] = useState<number>(0);
    const [showFriendPopup, setShowFriendPopup] = useState(false);
    // const [friends, setFriends] = useState<Friend[]>([]);

    const navigate = useNavigate()

    const handleClicChangeActivFriend = (e: MouseEvent<HTMLDivElement>): void => {
        let balise: HTMLDivElement = e.currentTarget as HTMLDivElement;
        
        if (balise.dataset.nb) //  && balise.dataset.status && balise.dataset.status == 'online'
        {
            setActivFriend(Number(balise.dataset.nb))
            // changer les messages affiches
        }
    }

    // const [profileData, setProfileData] = useState<ProfileDataType>({
    //         name: "",
    //         email: null,
    //         bio: null,
    //         profPicture: null,
    //         rank: 0,
    //         lang : null
    //     })
    

    const { fetchWithAuth } = useAuth();
    const { friends, setFriends } = useWebSocket();
    


    // idSender

    const [profileData, setProfileData] = useState<User | undefined>()

    function getUserParams() {
        fetchWithAuth(`https://localhost/api/user/get_profile/`)
            .then((response) => response.json())
            .then((json) => {
                const data = json.data
                console.log(data);
                setProfileData(new User(0, data.name, data.email, data.profPicture, data.bio, data.lang, data.isTwoFactorEnabled, data.rank));

            })
            .catch((error) => {
                console.error("Error :", error);
            });
    }


    const fetchFriends = async () => {
        try {
            const friends: Friend[] | undefined = await Friend.getFriends();
            if (friends != undefined)
            {
                // IL FAUT MODIFIER CA !

                friends.forEach(friend => {
                    friend.toggleConnected();
                    // il faut recuperer tout les messages
                });
                
                setFriends(friends);
                if (friends[0])
                    setActivFriend(friends[0].id);
            }
        } catch (error) {
            console.error("Erreur en récupérant les demandes d'ami :", error);
        }
    };

    useEffect(() => {
        getUserParams()
        fetchFriends();
    }, []);

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">

                <LeftChat activFriend={activFriend} friends={friends} onClickFriend={handleClicChangeActivFriend} setShowFriendPopup={setShowFriendPopup}/>

                <RightChat activFriend={activFriend} friends={friends} setFriends={setFriends} profileData={profileData as User}/>

                {showFriendPopup && (
                    <PopupFriendsComponent friends={friends} onClose={setShowFriendPopup} setFriends={setFriends}/>
                )}

            </div>
        </div>
    )
}
