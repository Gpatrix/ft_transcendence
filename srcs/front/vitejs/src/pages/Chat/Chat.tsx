import Header from "../../components/Header.tsx"
// import DropDownMenu from "../../components/DropDownMenu.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import { useNavigate } from 'react-router-dom';
import Friend from "../../classes/Friend.tsx"
import Message from "../../classes/Message.tsx"
import RightChat from './RightChat.tsx'
import LeftChat from './LeftChat.tsx'
import PopupFriendsComponent from "./PopupFriendsComponent.tsx";

export default function Chat() {

    const navigate = useNavigate();

    const [activFriend, setActivFriend] = useState<number>(0);
    const [showFriendPopup, setShowFriendPopup] = useState(false);
    // const [showOptionPopup, setShowOptionPopup] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([
        new Friend(0, 'Titi42', 'test@test.com', 'test.jpeg', [new Message(0, new Date(), "Ratio")], true),
        new Friend(1, 'Titi42', 'test@test.com', 'test.jpeg', [], true, 12),
        new Friend(2, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(3, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(4, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(5, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(6, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(7, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(8, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(9, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(10, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(11, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(12, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(13, 'testCo', 'test@test.com', 'test.jpeg', [], true),
        new Friend(14, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(15, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(16, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(17, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(18, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(19, 'Titi42', 'test@test.com', 'test.jpeg', [], false),
        new Friend(20, 'test', 'test@test.com', 'test.jpeg', [], false),
    ]);


    const handleClicChangeActivFriend = (e: MouseEvent<HTMLDivElement>): void => {
        let balise: HTMLDivElement = e.currentTarget as HTMLDivElement;
        if (balise.dataset.nb && balise.dataset.status && balise.dataset.status == 'online')
        {
            setActivFriend(Number(balise.dataset.nb))
            // changer les messages affiches
        }
    }

    // useEffect(() => {
    //     console.log(showFriendPopup);
    // }, [showFriendPopup]);

    return (
        <div className="chat flex flex-col h-1/1 ">
            <Header  />
            <div className="flex w-1/1 h-1/1 max-h-[91%] overflow-hidden">

                <LeftChat activFriend={activFriend} friends={friends} onClickFriend={handleClicChangeActivFriend} setShowFriendPopup={setShowFriendPopup}/>

                <RightChat activFriend={activFriend} friends={friends} setFriends={setFriends} />

                {showFriendPopup && (
                    <PopupFriendsComponent friends={friends} onClose={setShowFriendPopup} />
                )}

            </div>
        </div>
    )
}
