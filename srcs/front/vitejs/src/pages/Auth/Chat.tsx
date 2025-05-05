import { Link } from "react-router"
// import InputWithLabel from "../../components/InputWithLabel"
import ChatMessage from '../../components/ChatMessage.tsx'
import Button from "../../components/Button"
import UserContact from '../../components/UserContact.tsx'
import Header from "../../components/Header"
import Blur from "../../components/Blur"
import DropDownMenu from "../../components/DropDownMenu"
import InputWithIco from "../../components/InputWithIco"

import { cloneElement, MouseEvent, useEffect, useState } from "react";
import ClickableIco from "../../components/ClickableIco.tsx"

export default function Login() {
    const [inputSearch, setInputSearch] = useState<string>("");
    const [inputMessage, setInputMessage] = useState<string>("");

    const handleSubmitSearch = (event : React.FormEvent<HTMLFormElement>) => {
        console.log("test");
        // console.log(search)
        // console.log(message)
        event.preventDefault();
    }

    const handleSubmitMessage = (event : React.FormEvent<HTMLFormElement>) => {
        console.log("test");
        // console.log(search)
        // console.log(message)
        event.preventDefault();
    }

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };
    const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    // useEffect(() => {
    //     console.log(inputSearch);
    // }, [inputSearch]);

    // useEffect(() => {
    //     console.log(inputMessage);
    // }, [inputMessage]);

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

                    {/* <div className="max-h-8/10 relative pt-1/10 bg-dark-yellow"> */}
                    {/* <Blur /> */}
                        <div className="flex flex-col pt-3 gap-3 overflow-y-scroll max-h-1/1 max-h-8/10 p-3">
                            <UserContact status='online' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='online' notifs={12} userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='Titi42' image='/test.jpeg' />
                            <UserContact status='offline' userName='vcx' image='/test.jpeg' />
                            <UserContact status='offline' userName='TitiTest' image='/test.jpeg' />
                        </div>
                    {/* </div> */}

                </div>

                <div className="relative flex flex-col justify-end gap-5">
                    <Blur />
                    {/* <DropDownMenu /> */}
                    <div className="relative overflow-y-scroll flex flex-col gap-5 p-10 pt-[200px]">

                        <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
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
                        </ChatMessage>
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
                            <ClickableIco className="mx-[5px]" image={"/icons/game-alt.svg"} onClick={function (event: MouseEvent): void {
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
