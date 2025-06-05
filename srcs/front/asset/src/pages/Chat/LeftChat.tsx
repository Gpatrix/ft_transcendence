import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";
import { gpt } from "../../translations/pages_reponses"

type LeftChatProps = {
    friends: Friend[],
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
    setShowFriendPopup: React.Dispatch<SetStateAction<boolean>>;
}

export default function LeftChat({ setShowFriendPopup, friends, setFriends } : LeftChatProps) {

    const [inputSearch, setInputSearch] = useState<string>("");
    const [listFriends, setListFriends] = useState<Friend[]>([]);

    const { activFriend, setActivFriend } = useWebSocket();


    const handleSubmitSearch = (event : FormEvent<HTMLFormElement>) => {

        const regex = new RegExp(inputSearch, 'g');

        const tempsFriends: Friend[] = friends.filter((friend) => friend.name.match(regex));

        if (tempsFriends.length == 0 && inputSearch.length == 0)
            setListFriends(friends);
        else
            setListFriends(tempsFriends);
        event.preventDefault();
    }

    const handleClicChangeActivFriend = (e: MouseEvent<HTMLDivElement>): void => {
        let balise: HTMLDivElement = e.currentTarget as HTMLDivElement;
        
        if (balise.dataset.nb && activFriend != Number(balise.dataset.nb)) //  && balise.dataset.status && balise.dataset.status == 'online'
        {
            setActivFriend(Number(balise.dataset.nb))
            const newFriend: Friend[] = [...friends];
            const friend = newFriend.find(friend => friend.id == Number(balise.dataset.nb));
            if (friend)
                friend.nbNotifs = 0;
            setFriends(newFriend);
        }
    }
    
    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    useEffect(() => {
        setListFriends(friends);
    }, [friends])

    return (
        <div className="w-[15%] bg-dark border-0 border-r-1 border-yellow relative z-120 chat-pink-shadow ">
            <Button style="add" className="mt-3 block m-auto" onClick={() => setShowFriendPopup(true)}>{gpt("add_friend")}</Button>
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
                        image={friend.profPicture}
                        notifs={friend.nbNotifs}
                        onClick={handleClicChangeActivFriend}
                    />;
                })}
            </div>

        </div>
    )
}
