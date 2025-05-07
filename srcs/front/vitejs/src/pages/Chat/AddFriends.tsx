import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";

type AddFriendsProps = {
    test?: React.Dispatch<SetStateAction<number>>,
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function AddFriends({} : AddFriendsProps) {

    const [inputSearch, setInputSearch] = useState<string>("");

    const handleSubmitSearch = (event : FormEvent<HTMLFormElement>) => {
        console.log("test");

        // faire la recherche d'amis

        // server.post<{ Params: postUserFriendRequestParams }>('/api/user/friends/requests/:name', async (request: any, reply: any) => {


        event.preventDefault();
    }

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    const handleAddFriend = () => {
        alert("Add friend");
    }


    return (
        <div className="w-[100%]">
            <InputWithIco
                            className="m-3"
                            placeholder={"ex : Pseudo1234..."}
                            iconSrc={"/icons/search-alt.svg"}
                            value={inputSearch}
                            onChange={handleChangeSearch}
                            onSubmit={handleSubmitSearch}
            />

            <div className="flex flex-col gap-2">
                {/* faire une liste */}
                <UserContact status='none' className="relative" userName='Titi42' image='/test.jpeg' >
                    <button onClick={() => handleAddFriend()}
                        className="relative  border-2 border-yellow rounded-full w-6 h-6 flex items-center justify-center shrink-0 cursor-pointer">
                        <div className="w-[2px] h-[10px] bg-yellow absolute rounded-full"></div>
                        <div className="h-[2px] w-[10px] bg-yellow absolute rounded-full"></div>
                    </button>
                </UserContact>
            </div>

            

        </div>
    )
}
