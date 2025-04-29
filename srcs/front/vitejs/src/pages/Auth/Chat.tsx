import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import ChatMessage from '../../components/ChatMessage.tsx'
import Button from "../../components/Button"
import UserContact from '../../components/UserContact.tsx'
import Header from "../../components/Header"
import Blur from "../../components/Blur"
import DropDownMenu from "../../components/DropDownMenu"
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        // console.log(email)
        // console.log(password)
        event.preventDefault();
    }

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">
                <div className="w-[270px] bg-red p-3 bg-dark">
                    <Button >Ajouter un ami</Button>
                    {/* barre de recherche + separateur */}
                    {/* <div className="max-h-8/10 relative pt-1/10"> */}
                    {/* <Blur /> */}
                        <div className="flex flex-col pt-3 gap-3 overflow-scroll max-h-1/1 max-h-8/10">
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
                    <DropDownMenu />
                    <div className="relative overflow-scroll flex flex-col gap-5 p-10 pt-[100px]">

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

                </div>

            </div>
        </div>
    )
}
