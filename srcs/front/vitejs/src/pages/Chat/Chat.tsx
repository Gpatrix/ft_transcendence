import ChatMessage from '../../components/ChatMessage.tsx'
import Blur from "../../components/Blur.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, ChangeEvent, useEffect, useState, useRef } from "react";
import ClickableIco from "../../components/ClickableIco.tsx"
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"
import ButtonMenu from '../../components/ButtonMenu.tsx';
import { useWebSocket } from '../Auth/WebSocketComponent.tsx';
import User from '../../classes/User.tsx';
import { gpt } from "../../translations/pages_reponses.tsx"
import clsx from 'clsx';

type ChatProps = {
    // friends: Friend[],
    // setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
    profileData: User;
    classList?: string;
    chanel?: number;

    participants: User[];
    arrayMessage: Message[];
    setArrayMessage: React.Dispatch<React.SetStateAction<Message[]>>;
    blur?: boolean;
    // handleScroll: () => void;
    // handleSubmitMessage: (event: FormEvent<HTMLFormElement>) => void;
}

export default function Chat({ profileData, classList, chanel, participants, arrayMessage, setArrayMessage, blur=true} : ChatProps) {

    const { socket } = useWebSocket();

    const [inputMessage, setInputMessage] = useState<string>("");

    const containerRef = useRef<HTMLDivElement | null>(null);;
    const socketRef = useRef<WebSocket | null>(null);
    const participantsRef = useRef<User[]>([]);
    const profileDataRef = useRef<User | undefined>(undefined);

    // const activFriendRef = useRef<number>(-1);
    const arrayMessageLenghtRef = useRef<number>(0);

    const handleSubmitMessage = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputMessage != "") {
            console.log("send mess");
            
            if (socket && socket.readyState === WebSocket.OPEN) {
                if (chanel == undefined) {
                    const friend =  participantsRef.current.find(participant => participant.id != profileDataRef.current?.id);
                    if (friend && profileDataRef.current) {
                        const newMessage = Message.sendMessage(profileDataRef.current.id ,friend.id, inputMessage, socket)
                        if (newMessage != undefined) {
                            const newArrayMessage = [...arrayMessage];
                            newArrayMessage.splice(0, 0, newMessage);
                            setArrayMessage(newArrayMessage);
                            setInputMessage("");
                        }
                    }
                } else {
                    // gestion des chat ingame
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
                if (chanel == undefined) {
                    const friend = participantsRef.current.find(participant => participant.id != profileDataRef.current?.id)
                    if (friend != undefined)
                        socketRef.current.send(JSON.stringify({ action: 'refresh', targetId: friend.id, take:20, skip:arrayMessageLenghtRef.current}));
                }
                // else {
                    // trouver comment refresh les messages un game
                    // c'est possible ou on s'en fout de l'historique ?
                // }
            }
        }
    };

    // function getUserParams() {
    //     fetchWithAuth(`/api/user/get_profile/`)
    //     .then((response) => response.json())
    //     .then((json) => {
    //         const data = json.data
            
    //         setProfileData(new User(0, data.name, data.email, data.profPicture, data.bio, data.lang, data.isTwoFactorEnabled, data.rank));
    //         return(true);
    //     })
    //     .catch((error) => {
    //         console.error("Error :", error);
    //     });
    // }

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
        arrayMessageLenghtRef.current = arrayMessage.length;
    }, [arrayMessage]);

    useEffect(() => {
        participantsRef.current = participants;
    }, [participants]);

    useEffect(() => {
        profileDataRef.current = profileData;
    }, [profileData]);

    return (
        <div className={clsx("w-1/1 flex flex-col justify-end", classList)}>
            {blur && <Blur />}
            <div ref={containerRef} className="relative overflow-y-scroll flex flex-col-reverse gap-5 p-10 pt-[200px]">

                {participants.length > 1 && arrayMessage.map((message, id) => {
                    let user = participants.find((user) => user?.id == message.idSender) as Friend;
                    if (user != undefined)
                        return  <ChatMessage key={id} profileIco={user.profPicture} username={user.name} hour={message.date.getHours() + ":" + message.date.getMinutes()} >
                                    {message.content}
                                </ChatMessage>
                    else
                        return ""
                })}
            </div>

            {profileData && participants.length > 1 && <div className="w-1/1 bg-dark border-0 border-t-1 border-yellow flex p-3 gap-2">
                <InputWithIco className="w-[100%] rounded-xl"
                    placeholder={gpt("send_message")
                        + (participants.length == 2 ? (participants.find(participant =>  participant.id != profileData.id) as User) : gpt("send_message"))
                    }
                    iconSrc={"/icons/icon_chat.svg"}
                    value={inputMessage}
                    onChange={handleChangeMessage}
                    onSubmit={handleSubmitMessage}
                />
                {chanel == undefined && <div className="bg-yellow rounded-xl">
                    <ClickableIco className="mx-[5px]" image={"/icons/game-alt.svg"} onClick={function (): void {
                        console.log("Game !");
                    } } />

                </div>}
            </div>}
        </div>
    )
}