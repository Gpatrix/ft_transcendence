import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";

type RequestFriendsProps = {
    test?: React.Dispatch<SetStateAction<number>>,
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function RequestFriends({} : RequestFriendsProps) {

    const handleAcceptRequest = () => {
        alert("accepte");
    }

    const handleRefuseRequest = () => {
        alert("refuse");
    }


    return (
        <div className="w-[100%] pt-3">
            {/* <UserContact userName={"test"} /> */}
            <div className="flex flex-col gap-2">
                {/* faire une liste */}
                <UserContact status='none'  userName='Titi42' image='/test.jpeg' >
                    <ClickableIco image='/icons/accept.svg' onClick={()=> handleAcceptRequest()} className="w-[30px] mr-1"/>
                    <ClickableIco image='/icons/trash.svg' onClick={()=> handleRefuseRequest()}/>
                </UserContact>
                <UserContact status='none'  userName='Titi42' image='/test.jpeg' >
                    <ClickableIco image='/icons/accept.svg' onClick={()=>alert('test')} className="w-[30px] mr-1"/>
                    <ClickableIco image='/icons/trash.svg' onClick={()=>alert('test')}/>
                </UserContact>
            </div>
        </div>
    )
}
