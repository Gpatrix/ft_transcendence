import { useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";
import FriendRequest from "../../classes/FriendRequest.tsx";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";
import { gpt } from "../../translations/pages_reponses.tsx";

type RequestFriendsProps = {
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
}

export default function RequestFriends({ setFriends } : RequestFriendsProps) {

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

        if (codeError / 100 != 2)
        {
            const newFriendRequestTab: FriendRequest[] = [...friendRequestTab];
            newFriendRequestTab.splice(i, 1);
            setFriendRequestTab(newFriendRequestTab);
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
                if (friends != undefined)
                    setFriendRequestTab(friends);
            } catch (error) {
                console.error("Error :", error);
            }
        };

        fetchFriends();
    }, []); 


    return (
        <div className="w-[100%] pt-3">
            {/* <UserContact userName={"test"} /> */}
            <div className="flex flex-col gap-2">
                {/* faire une liste */}
                {friendRequestTab.map((friendRequest, i) => {

                    if (friendRequest.author) {
                        return (<UserContact key={i} status='none'  userName={friendRequest.author.name} image={friendRequest.author.profPicture} >
                            <ClickableIco image='/icons/accept.svg' onClick={()=> handleAcceptRequest(friendRequest, i)} className="w-[30px] mr-1"/>
                            <ClickableIco image='/icons/trash.svg' onClick={()=> handleRefuseRequest(friendRequest, i)}/>
                        </UserContact>);
                        }
                    else
                        return("");
                })}
                {friendRequestTab.length == 0 && <p className="text-yellow text-center">{gpt("no_invitation")}</p>}
            </div>
        </div>
    )
}
