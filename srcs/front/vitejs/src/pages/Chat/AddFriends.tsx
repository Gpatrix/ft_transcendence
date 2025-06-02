import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, ChangeEvent, useState } from "react";
import Friend from "../../classes/Friend.tsx"
import User from "../../classes/User.tsx";
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";
import { get_server_translation } from "../../translations/server_responses.tsx";
import { gpt } from "../../translations/pages_reponses.tsx";

type AddFriendsProps = {}

export default function AddFriends({} : AddFriendsProps) {

    const [inputSearch, setInputSearch] = useState<string>("");
    const [inputResponse, setInputResponse] = useState<string>("");
    const [usersSearched, setUsersSearched] = useState<User[] | undefined>([]);

    const handleSubmitSearch = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response: User[] | undefined | string = await User.searchUserByName(inputSearch)

        if (typeof response == 'string') {
            setInputResponse(response)
            setUsersSearched([]);
        }
        else {
            setUsersSearched(response);
            setInputResponse("")
        }
        setInputSearch("");
    }

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    const handleSendFriendRequest = async (id: number) => {
        const response = await Friend.friendRequest(id)

        setUsersSearched([]);
        setInputResponse(response)
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

                {usersSearched && usersSearched.map(user => {
                    return <UserContact key={user.id} status='none'  userName={user.name} image={user.profPicture} >
                                <ClickableIco image='/icons/circle-plus.svg' onClick={()=> handleSendFriendRequest(user.id)} className="w-[30px] mr-1"/>
                            </UserContact>
                })}

                {
                    Math.round(Number(inputResponse) / 100) == 2 &&
                    <div className="py-2 text-green">{gpt("Request_sent")}</div>
                }
                {
                    Math.round(Number(inputResponse) / 100) != 2 && inputResponse != "" &&
                    <div className="py-2 text-light-red">{get_server_translation((inputResponse))}</div>
                }

                <div>

                </div>

                {/* faire une liste ? */}
                {/* <UserContact status='none' className="relative" userName='Titi42' image='/test.jpeg' >
                    <button onClick={() => handleAddFriend()}
                        className="relative  border-2 border-yellow rounded-full w-6 h-6 flex items-center justify-center shrink-0 cursor-pointer">
                        <div className="w-[2px] h-[10px] bg-yellow absolute rounded-full"></div>
                        <div className="h-[2px] w-[10px] bg-yellow absolute rounded-full"></div>
                    </button>
                </UserContact> */}
            </div>

            

        </div>
    )
}
