import ChatMessage from '../../components/ChatMessage.tsx'
import Blur from "../../components/Blur.tsx"
// import DropDownMenu from "../../components/DropDownMenu.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, ChangeEvent, useEffect, useState, useRef } from "react";
// import { useNavigate } from 'react-router-dom';
import ClickableIco from "../../components/ClickableIco.tsx"
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"
import ButtonMenu from '../../components/ButtonMenu.tsx';
import { useWebSocket } from '../Auth/WebSocketComponent.tsx';
import User from '../../classes/User.tsx';
import { gpt } from "../../translations/pages_reponses"

type RightChatProps = {
    friends: Friend[],
    setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
    profileData: User;
}

export default function RightChat({ friends, setFriends, profileData} : RightChatProps) {

    const { socket, activFriend, arrayMessage, setArrayMessage  } = useWebSocket();

    const [inputMessage, setInputMessage] = useState<string>("");

    const containerRef = useRef<HTMLDivElement | null>(null);;
    const socketRef = useRef<WebSocket | null>(null);
    const activFriendRef = useRef<number>(-1);
    const arrayMessageLenghtRef = useRef<number>(0);

    const handleSubmitMessage = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputMessage != "")
        {
            if (socket && socket.readyState === WebSocket.OPEN) {
                 const newMessage = Message.sendMessage(-1, activFriend, inputMessage, socket)
                if (newMessage != undefined) {
                    const newArrayMessage = [...arrayMessage];
                    newArrayMessage.splice(0, 0, newMessage);
                    setArrayMessage(newArrayMessage);
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

    const handleScroll = () => {
        
        const container = containerRef.current;
        if (!container) return;

        if (container.scrollHeight + container.scrollTop === container.clientHeight) {
            if (socketRef.current) {
                socketRef.current.send(JSON.stringify({ action: 'refresh', targetId: activFriendRef.current, take:20, skip:arrayMessageLenghtRef.current}));
            }
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
    
        container.addEventListener('scroll', handleScroll);
        
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
    }, [])

    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    useEffect(() => {
        activFriendRef.current = activFriend;
    }, [activFriend]);

    useEffect(() => {
        arrayMessageLenghtRef.current = arrayMessage.length;
    }, [arrayMessage]);

    return (
        <div className="relative w-[85%] flex flex-col justify-end gap-5 w-1/1">
            {friends.find(friend => friend.id == activFriend) != undefined && <ButtonMenu className="top-5 right-5" setFriends={setFriends} friendId={activFriend} profileData={profileData} />}
            <Blur />
            <div ref={containerRef} className="relative overflow-y-scroll flex flex-col-reverse gap-5 p-10 pt-[200px]">

                {friends.find(friend => friend.id == activFriend) != undefined && arrayMessage.map((message, id) => {
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

            {friends.find(friend => friend.id == activFriend) != undefined && <div className="w-1/1 bg-dark border-0 border-t-1 border-yellow flex p-3 gap-2">
                <InputWithIco className="w-[100%] rounded-xl"
                    placeholder={gpt("send_message")+ friends.find(friend => friend.id == activFriend)?.name}
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
            </div>}
        </div>
    )
}