import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";

type LeftChatProps = {
    activFriend: number;
    friends: Friend[],
    onClickFriend : React.MouseEventHandler<HTMLDivElement>;
    setShowFriendPopup: React.Dispatch<SetStateAction<boolean>>;
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function LeftChat({activFriend, friends, onClickFriend, setShowFriendPopup} : LeftChatProps) {

    const [inputSearch, setInputSearch] = useState<string>("");
    const [listFriends, setListFriends] = useState<Friend[]>(friends);


    const handleSubmitSearch = (event : FormEvent<HTMLFormElement>) => {
        console.log("test");

        const regex = new RegExp(inputSearch, 'g');
        // paragraph.match(regex);
        const tempsFriends: Friend[] = friends.filter((friend) => friend.name.match(regex));

        console.log(tempsFriends);
        

        if (tempsFriends.length == 0 && inputSearch.length == 0)
            setListFriends(friends);
        else
            setListFriends(tempsFriends);
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
                {listFriends.map((friend, id) => {
                    return <UserContact key={id} nb={friend.id}
                        type={friend.id==activFriend?'active':'nonactive'}
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
