import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, ChangeEvent, useState } from "react";
import Friend from "../../classes/Friend.tsx"
import User from "../../classes/User.tsx";
import UserContact from "../../components/UserContact.tsx";
import ClickableIco from "../../components/ClickableIco.tsx";

type AddFriendsProps = {
    // test?: React.Dispatch<SetStateAction<number>>,
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function AddFriends({} : AddFriendsProps) {

    const [inputSearch, setInputSearch] = useState<string>("");
    const [inputResponse, setInputResponse] = useState<number>(-1);
    const [usersSearched, setUsersSearched] = useState<User[] | undefined>([]);

    const handleSubmitSearch = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // faire l'affichage de toutes les erreurs 
        const users: User[] | undefined | string = await User.searchUserByName(inputSearch)

        // ajouter les codes d'erreurs
        if (typeof users == 'string') {
            setInputResponse(Number(users))
            setUsersSearched([]);
            console.log("log cette erreur sur la page");
        }
        else {
            setUsersSearched(users);
            setInputResponse(-1)
        }
            
        // setInputResponse(await Friend.friendRequest(inputSearch));
        setInputSearch("");

    }

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    const handleSendFriendRequest = async (id: number) => {
        const users = await Friend.friendRequest(id)

        setUsersSearched([]);
        setInputResponse(Number(users))
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
                    Math.round(inputResponse / 100) == 2 &&
                    <div className="py-2 text-green">Requete envoyée</div>
                }
                {
                    Math.round(inputResponse / 100) != 2 && inputResponse != -1 &&
                    <div className="py-2 text-light-red">{inputResponse}</div>
                    // utiliset getServeurTranslation
                    // 401 = vous meme
                    // 429 = invitation deja envoye
                    // 500 = utilisateur non existant
                    // 404 = deja en ami
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
