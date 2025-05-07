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


    return (
        <div className="w-[100%]">
            <UserContact userName={"test"} />
            {/* <UserContact status='online'  userName='Titi42' image='/test.jpeg' >
                <ClickableIco image='/icons/icon_chat.svg' onClick={()=>alert('test')}/>
                <ClickableIco image='/icons/icon_chat.svg' onClick={()=>alert('test')}/>
            </UserContact>  */}
        </div>
    )
}
