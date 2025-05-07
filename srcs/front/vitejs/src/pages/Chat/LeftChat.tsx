import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";

type LeftChatProps = {
    activFriend: number;
    friends: Friend[],
    onClickFriend : React.MouseEventHandler<HTMLButtonElement>;
    setShowFriendPopup: React.Dispatch<SetStateAction<boolean>>;
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function LeftChat({activFriend, friends, onClickFriend, setShowFriendPopup} : LeftChatProps) {

    const [inputSearch, setInputSearch] = useState<string>("");


    const handleSubmitSearch = (event : FormEvent<HTMLFormElement>) => {
        console.log("test");

        event.preventDefault();
    }
    
    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    return (
        <div className="w-[270px] bg-dark border-0 border-r-1 border-yellow relative z-120 chat-pink-shadow ">
            <Button style="add" className="mt-3 block m-auto" onClick={() => setShowFriendPopup(true)}>Ajouter un ami</Button>
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
                        onClick={onClickFriend}
                    />;
                })}
            </div>

        </div>
    )
}
