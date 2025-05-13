import ChatMessage from '../../components/ChatMessage.tsx'
import Blur from "../../components/Blur.tsx"
// import DropDownMenu from "../../components/DropDownMenu.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
// import { useNavigate } from 'react-router-dom';
import ClickableIco from "../../components/ClickableIco.tsx"
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"
import ButtonMenu from '../../components/ButtonMenu.tsx';
import { useWebSocket } from '../Auth/WebSocketComponent.tsx';
import User from '../../classes/User.tsx';

interface payloadstruct
{
    action: string; // "msg", "game_msg", "refresh"
    targetId: number;
    skip?: number;
    take?: number;
    msg?: string;
}

type RightChatProps = {
    activFriend: number;
    friends: Friend[],
    setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
    profileData: User;
    // openMenu: React.Dispatch<SetStateAction<boolean>>;
    // isOpenMenu: boolean;
    // onClose: React.Dispatch<SetStateAction<boolean>>;

    // passer en props le onClick de ClickableIco
}

export default function RightChat({activFriend, friends, setFriends, profileData} : RightChatProps) {

    // const navigate = useNavigate();
    const { socket } = useWebSocket();

    const [inputMessage, setInputMessage] = useState<string>("");

    const handleSubmitMessage = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputMessage != "")
        {
            if (socket && socket.readyState === WebSocket.OPEN) {
                 const newMessage = Message.sendMessage(-1, activFriend, inputMessage, socket)
                if (newMessage != undefined) {
                    const newFriends = [...friends];
                    newFriends.find((friend) => friend.id == activFriend)?.addMessages(newMessage);
                    setFriends(newFriends);
                    setInputMessage("");
                }
            } else {
                console.warn('Socket non connectée');
            }
        }
    }
    
    const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    // const handleOpenMenu : React.MouseEventHandler<HTMLButtonElement> = () => {
    //     openMenu(true);
    // };



    return (
        <div className="relative flex flex-col justify-end gap-5 w-1/1">
            <ButtonMenu className="top-5 right-5" setFriends={setFriends} friendId={activFriend} />
            <Blur />
            <div className="relative overflow-y-scroll flex flex-col-reverse gap-5 p-10 pt-[200px]">

                {friends.length > 0 && friends.find((friend) => friend.id == activFriend)?.messages.map((message, id) => {
                        let friend = friends.find((friend) => friend.id == activFriend) as Friend;
                        if (message.idSender == activFriend)
                            return  <ChatMessage key={id} profileIco={friend.profPicture} username={friend.name} hour={message.date.getHours() + ":" + message.date.getMinutes()} >
                                        {message.content}
                                    </ChatMessage>
                        else
                            return  <ChatMessage key={id} profileIco={profileData.profPicture} username={profileData.name} hour={message.date.getHours() + ":" + message.date.getMinutes()} >
                                        {message.content}
                                    </ChatMessage>     
                    })}
            </div>

            <div className="w-1/1 bg-dark border-0 border-t-1 border-yellow flex p-3 gap-2">
                <InputWithIco className="w-[100%] rounded-xl"
                    placeholder={"Envoyer un message a"}
                    iconSrc={"/icons/icon_chat.svg"}
                    value={inputMessage}
                    onChange={handleChangeMessage}
                    onSubmit={handleSubmitMessage}
                />
                <div className="bg-yellow rounded-xl">
                    <ClickableIco className="mx-[5px]" image={"/icons/game-alt.svg"} onClick={function (): void {
                        console.log("Game !");
                        // navigate('/game'); + ajout utilisateur selectionne en game
                    } } />

                </div>
            </div>
        </div>
    )
}
