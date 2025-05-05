import { Link } from "react-router"
// import InputWithLabel from "../../components/InputWithLabel"
import ChatMessage from '../../components/ChatMessage.tsx'
import Button from "../../components/Button"
import UserContact from '../../components/UserContact.tsx'
import Header from "../../components/Header"
import Blur from "../../components/Blur"
import DropDownMenu from "../../components/DropDownMenu"
import InputWithIco from "../../components/InputWithIco"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState } from "react";
import ClickableIco from "../../components/ClickableIco.tsx"
import User from "../../classes/User.tsx"
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"

export default function Login() {
    const [inputSearch, setInputSearch] = useState<string>("");
    const [inputMessage, setInputMessage] = useState<string>("");
    const [activFriend, setActivFriend] = useState<number>(0);

    const handleSubmitSearch = (event : FormEvent<HTMLFormElement>) => {
        console.log("test");
        // console.log(search)
        // console.log(message)
        event.preventDefault();
    }

    const handleSubmitMessage = (event : FormEvent<HTMLFormElement>) => {
        console.log("test");
        // console.log(search)
        // console.log(message)
        event.preventDefault();
    }
    
    // HTMLAnchorElement
    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };
    const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    const handleClicChangeActivFriend = (e: MouseEvent<HTMLButtonElement>): void => {
        let balise: HTMLButtonElement = e.currentTarget as HTMLButtonElement;
        if (balise.dataset.nb && balise.dataset.status && balise.dataset.status == 'online')
        {
            setActivFriend(Number(balise.dataset.nb))
            // changer les messages affiches
        }
    }


    // useEffect(() => {
    //     console.log(inputSearch);
    // }, [inputSearch]);

    // useEffect(() => {
    //     console.log(inputMessage);
    // }, [inputMessage]);

    const friends : Friend[] = [
        new Friend(0, 'Titi42', 'test@test.com', 'test.jpeg', [new Message(0, new Date(), "Ratio")], true),
        new Friend(1, 'Titi42', 'test@test.com', 'test.jpeg', [], true, 12),
        new Friend(2, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(3, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(4, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(5, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(6, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(7, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(8, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(9, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(10, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(11, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(12, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(13, 'testCo', 'test@test.com', 'test.jpeg', [], true),
        new Friend(14, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(15, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(16, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(17, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(18, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(19, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(20, 'test', 'test@test.com', 'test.jpeg', [], false),
    ];

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">
                <div className="w-[270px] bg-dark border-0 border-r-1 border-yellow relative z-120 chat-pink-shadow ">
                    <Button style="add" className="mt-3 block m-auto">Ajouter un ami</Button>
                    {/* barre de recherche + separateur */}
                    <InputWithIco
                        className="m-3"
                        placeholder={"ex : Pseudo1234..."}
                        iconSrc={"/icons/search-alt.svg"}
                        value={inputSearch}
                        onChange={handleChangeSearch}
                        onSubmit={handleSubmitSearch}
                    />
                    <div className="h-[1px] w-4/5 bg-dark-yellow mx-auto my-3"></div>

                    <div className="flex flex-col pt-3 gap-3 overflow-y-scroll max-h-1/1 max-h-8/10 p-3">
                        {friends.map((friend, id) => {
                            return <UserContact key={id} nb={id}
                                type={id==activFriend?'active':'nonactive'}
                                status={friend.connected ? 'online' : 'offline'}
                                className={friend.connected ? 'order-first' : ''}
                                userName={friend.name}
                                image={friend.imageUrl}
                                notifs={friend.nbNotifs}
                                onClick={handleClicChangeActivFriend}
                            />;
                        })}
                    </div>

                </div>

                <div className="relative flex flex-col justify-end gap-5 w-1/1">
                    <Blur />
                    {/* <DropDownMenu /> */}
                    <div className="relative overflow-y-scroll flex flex-col-reverse gap-5 p-10 pt-[200px]">

                        {/* <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aliquet gravida lacinia. Vivamus convallis sit amet nunc sit amet sodales. In molestie ipsum est, id gravida lorem elementum et. Maecenas
                        </ChatMessage>
        
                        <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
                            Quisque lorem felis, dictum eu condimentum eget, aliquet at eros. 
                        </ChatMessage>
                
                        <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
                            Morbi a erat a ipsum posuere consectetur. Maecenas fermentum euismod lectus sed rhoncus. Praesent placerat sem vehicula sapien pretium facilisis. Aliquam aliquam lacus et faucibus consequat. 
                        </ChatMessage>
                        <ChatMessage profileIco='/test.jpeg' username='Lichar1337' profileLink='google.com' hour='13:12' >
                            Duis aliquet gravida lacinia. sit amet nunc sit amet sodales. 
                        </ChatMessage>

                        <ChatMessage profileIco='/test.jpeg' username='PepitoDeLaVega35' profileLink='google.com' hour='13:12' >
                            Issou
                        </ChatMessage>
                        <ChatMessage profileIco='/test.jpeg' username='PepitoDeLaVega35' profileLink='google.com' hour='13:12' >
                            Issou
                        </ChatMessage>
                        <ChatMessage profileIco='/test.jpeg' username='PepitoDeLaVega35' profileLink='google.com' hour='13:12' >
                            Issou
                        </ChatMessage>
                        <ChatMessage profileIco='/test.jpeg' username='PepitoDeLaVega35' profileLink='google.com' hour='13:12' >
                            Issou
                        </ChatMessage> */}
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
                                throw new Error("Function not implemented.")
                            } } />

                        </div>
                        {/* <img className="" src="/icons/game-alt.svg" /> */}
                    </div>

                </div>

            </div>
        </div>
    )
}
