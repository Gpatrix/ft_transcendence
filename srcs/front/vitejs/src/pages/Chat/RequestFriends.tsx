import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";
import FriendRequest from "../../classes/FriendRequest.tsx";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";
import User from "../../classes/User.tsx";

type RequestFriendsProps = {
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
    profileData: User;
}

export default function RequestFriends({setFriends, profileData} : RequestFriendsProps) {

    const { socket } = useWebSocket();
    
    const [friendRequestTab, setFriendRequestTab] = useState<FriendRequest[]>([]);

    const handleAcceptRequest = async (friendRequest: FriendRequest, i: number) => {
        await friendRequest.accepteRequest();
        const newFriendRequestTab: FriendRequest[] = [...friendRequestTab];
        newFriendRequestTab.splice(i, 1);
        setFriendRequestTab(newFriendRequestTab);

        try {
            if (socket)
                socket.send(JSON.stringify({ action: 'acceptRequest', targetId: friendRequest.authorId }));
            const friends: Friend[] | undefined = await Friend.getFriends();
            console.log(friends);
            if (friends != undefined)
            {
                // IL FAUT MODIFIER CA !

                friends.forEach(friend => {
                    friend.toggleConnected();
                    // il faut recuperer tout les messages
                });
                
                setFriends(friends);
            }
        } catch (error) {
            console.error("Erreur en récupérant les demandes d'ami :", error);
        }
    }

    const handleRefuseRequest = async (friendRequest: FriendRequest, i: number) => {
        const codeError = await friendRequest.refuseRequest();

        console.log("Code error : " + codeError);

        if (codeError / 100 != 2)
        {
            alert("Erreur 200");
        }
        else
        {
            const newFriendRequestTab: FriendRequest[] = [...friendRequestTab];
            newFriendRequestTab.splice(i, 1);
            setFriendRequestTab(newFriendRequestTab);
        }
    }

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friends: FriendRequest[] | undefined = await Friend.getFriendsRequest();
                console.log(friends);
                if (friends != undefined)
                    setFriendRequestTab(friends); // Met à jour l'état avec les amis
            } catch (error) {
                console.error("Erreur en récupérant les demandes d'ami :", error);
            }
        };

        fetchFriends(); // Appelle la fonction asynchrone
    }, []); 


    return (
        <div className="w-[100%] pt-3">
            {/* <UserContact userName={"test"} /> */}
            <div className="flex flex-col gap-2">
                {/* faire une liste */}
                {friendRequestTab.map((friendRequest, i) => {

                    if (friendRequest.author) {
                        console.log(friendRequest.author);
                        console.log(friendRequest.author.name);
                        
                        return (<UserContact key={i} status='none'  userName={friendRequest.author.name} image={friendRequest.author.profPicture} >
                            <ClickableIco image='/icons/accept.svg' onClick={()=> handleAcceptRequest(friendRequest, i)} className="w-[30px] mr-1"/>
                            <ClickableIco image='/icons/trash.svg' onClick={()=> handleRefuseRequest(friendRequest, i)}/>
                        </UserContact>);
                        }
                    else
                        return("");
                })}
                {friendRequestTab.length == 0 && <p className="text-yellow text-center">Aucune invitation</p>}
            </div>
        </div>
    )
}
