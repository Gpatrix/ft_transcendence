import ChatMessage from '../../components/ChatMessage.tsx'
import Blur from "../../components/Blur.tsx"
// import DropDownMenu from "../../components/DropDownMenu.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import ClickableIco from "../../components/ClickableIco.tsx"
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"

type RightChatProps = {
    activFriend: number;
    friends: Friend[],
    setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
    // passer en props le onClick de ClickableIco
}

export default function RightChat({activFriend, friends, setFriends} : RightChatProps) {

    // const navigate = useNavigate();

    const [inputMessage, setInputMessage] = useState<string>("");

    const handleSubmitMessage = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputMessage != "")
        {
            console.log("document.cookie");
            console.log(document.cookie);
            

            try {
                // tout les checks
    
                const requestData = {
                    method :  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                    { 
                        "action": "msg",
                        "target": "obo",
                        "msg": inputMessage
                    })
                }
                fetch('/api/chat/connect', requestData) // url a fetch
                .then(response => {
                    console.log("response :");
                    console.log(response);
                    
                    if (response.ok)
                    {
                        // cas de reussite
                        const newFriends = [...friends];
                        newFriends[activFriend].addMessages(new Message(0, new Date(), inputMessage));

                        setFriends(newFriends);
                        setInputMessage("");
                    }
                    else
                    {
                        // cas d'erreur
                        console.log("C'est tliste");
                        
                    }
                })
    
                // set toutes les erreurs ""
            }
            catch(e) {
                console.error("Pas de chance !");
                console.error(e);
                // if (e instanceof AuthError) { // frontend error
                //     // inscrire les erreurs
                // }
                // else if (e instanceof Error) { // backend error
                //     // inscrire les erreurs
                // }
            }


            // const newFriends = [...friends];
            // newFriends[activFriend].addMessages(new Message(0, new Date(), inputMessage));

            // setFriends(newFriends);
            // setInputMessage("");
        }
    }
    
    const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };


    return (
        <div className="relative flex flex-col justify-end gap-5 w-1/1">
            <Blur />
            {/* <DropDownMenu /> */}
            <div className="relative overflow-y-scroll flex flex-col-reverse gap-5 p-10 pt-[200px]">

                {friends[activFriend].messages.map((message, id) => {
                    let friend = friends[activFriend];
                    return  <ChatMessage key={id} profileIco={friend.imageUrl} username={friend.name} profileLink='google.com' hour={'13:12'} >
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
                        // passer un props le onClick
                        // navigate('/game');
                    } } />

                </div>
            </div>
        </div>
    )
}
