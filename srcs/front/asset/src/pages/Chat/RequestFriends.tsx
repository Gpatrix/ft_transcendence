import { useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";
import FriendRequest from "../../classes/FriendRequest.tsx";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";
import { gpt } from "../../translations/pages_reponses.tsx";
import { get_server_translation } from "../../translations/server_responses.tsx";

type RequestFriendsProps = {
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
}

export default function RequestFriends({ setFriends } : RequestFriendsProps) {

    const { socket } = useWebSocket();
    
    const [friendRequestTab, setFriendRequestTab] = useState<FriendRequest[]>([]);
    const [errorCode, setErrorCode] = useState<string>("");

    

    const handleAcceptRequest = async (friendRequest: FriendRequest, i: number) => {
        const res = await friendRequest.accepteRequest();
        if (res != "200") {
            setErrorCode(res);
            return ;
        }
        const newFriendRequestTab: FriendRequest[] = [...friendRequestTab];
        newFriendRequestTab.splice(i, 1);
        setFriendRequestTab(newFriendRequestTab);

        try {
            if (socket)
            {
                socket.send(JSON.stringify({ action: 'acceptRequest', targetId: friendRequest.authorId }));
                const response: Friend[] | string = await Friend.getFriends();
                if (typeof response != "string")
                {
                    setFriends(response);
                    setErrorCode("");
                } else {
                    setErrorCode(response);   
                }
            } else {
                console.warn('Socket non connectée');
                setErrorCode("0500");
            }
        } catch (error) {
            setErrorCode("0500");   
        }
    }

    const handleRefuseRequest = async (friendRequest: FriendRequest, i: number) => {
        const codeError = await friendRequest.refuseRequest();

        if (codeError == "200")
        {
            const newFriendRequestTab: FriendRequest[] = [...friendRequestTab];
            newFriendRequestTab.splice(i, 1);
            setFriendRequestTab(newFriendRequestTab);
            setErrorCode("")
            return ;
        }
        setErrorCode(codeError)
    }

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response: FriendRequest[] | string = await Friend.getFriendsRequest();
                if (typeof response == "string")
                    setErrorCode(response)
                else
                {
                    setErrorCode("");   
                    setFriendRequestTab(response);
                }
            } catch (error) {
                setErrorCode("0500");   
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
                {friendRequestTab.length == 0 && errorCode && <p className="text-light-red text-center">{get_server_translation(errorCode)}</p>}
            </div>
        </div>
    )
}
