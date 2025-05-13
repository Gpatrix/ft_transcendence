import Header from "../../components/Header.tsx"
// import DropDownMenu from "../../components/DropDownMenu.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"
import RightChat from './RightChat.tsx'
import LeftChat from './LeftChat.tsx'
import PopupFriendsComponent from "./PopupFriendsComponent.tsx";
import { useAuth } from "../../AuthProvider.tsx";
import { ProfileDataType } from "../Profile/me/MyProfile.tsx";

export default function Chat() {

    const [activFriend, setActivFriend] = useState<number>(0);
    const [showFriendPopup, setShowFriendPopup] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    // [
    //     new Friend(0, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [new Message(0, new Date(), "Ratio")], true),
    //     new Friend(1, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], true, 12),
    //     new Friend(2, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(3, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(4, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(5, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(6, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(7, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(8, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(9, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(10, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(11, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(12, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(13, 'testCo', 'test@test.com', 'test.jpeg', "", 0, [], true),
    //     new Friend(14, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(15, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(16, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(17, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(18, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(19, 'Titi42', 'test@test.com', 'test.jpeg', "", 0, [], false),
    //     new Friend(20, 'test', 'test@test.com', 'test.jpeg', "", 0, [], false),
    // ]


    const handleClicChangeActivFriend = (e: MouseEvent<HTMLDivElement>): void => {
        let balise: HTMLDivElement = e.currentTarget as HTMLDivElement;
        
        if (balise.dataset.nb) //  && balise.dataset.status && balise.dataset.status == 'online'
        {
            setActivFriend(Number(balise.dataset.nb))
            // changer les messages affiches
        }
    }

    const [profileData, setProfileData] = useState<ProfileDataType>({
        name: "",
        email: null,
        bio: null,
        profPicture: null,
        rank: 0,
        lang : null
    })

    const { fetchWithAuth } = useAuth();

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

    const getUserParams = async () => {
        fetchWithAuth(`https://localhost/api/user/get_profile/`)
        .then((response) => response.json())
        .then((json) => {
            const data = json.data
            setProfileData(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                bio: data.bio,
                profPicture: data.profPicture,
                rank: data.rank,
                lang: data.lang
            }));
        })
        .catch((error) => {
            console.error("Error :", error);
        });
    }

    useEffect(() => {
        getUserParams()
        fetchFriends();
    }, []);

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">

                <LeftChat activFriend={activFriend} friends={friends} onClickFriend={handleClicChangeActivFriend} setShowFriendPopup={setShowFriendPopup}/>

                <RightChat activFriend={activFriend} friends={friends} setFriends={setFriends}/>

                {showFriendPopup && (
                    <PopupFriendsComponent friends={friends} onClose={setShowFriendPopup} setFriends={setFriends}/>
                )}

            </div>
        </div>
    )
}
