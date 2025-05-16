import Button from "../../components/Button.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import RequestFriends from "./RequestFriends.tsx";
import AddFriends from "./AddFriends.tsx";
import User from "../../classes/User.tsx";

type PopupFriendsComponentProps = {
    friends: Friend[],
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
    onClose: React.Dispatch<SetStateAction<boolean>>;
    profileData: User;
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function PopupFriendsComponent({onClose, friends,setFriends, profileData} : PopupFriendsComponentProps) {

    const [onglet, setOnglet] = useState<"waiting" | "add">("waiting");

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            console.log("test");
            window.removeEventListener("keydown", handleKeyDown);
            onClose(false);
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return (
        <div className="w-[100vw] h-[100vh] fixed z-999 top-0 left-0">
            <div className="fixed z-10 w-1/1 h-1/1 bg-(--dark-transp) top-0 left-0 cursor-pointer" onClick={() => onClose(false)}></div>
            <div className="relative max-w-[100%] w-[500px] z-20 bg-dark border border-yellow rounded-[3vw] shadow-yellow p-5 absolute top-[50%] left-[50%] translate-[-50%]">
                <button onClick={() => onClose(false)}
                    className="absolute right-3 top-3 border-3 border-yellow rounded-full w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer">
                    <div className="w-1 h-5 bg-yellow rotate-z-[45deg] absolute rounded-full"></div>
                    <div className="h-1 w-5 bg-yellow rotate-z-[45deg] absolute rounded-full"></div>
                </button>
                <div className="flex justify-center">
                    {/* ajouter une ombre */}
                    <Button type={onglet=="waiting"?"full":"stroke"} style="popup" className={"mt-3" + (onglet=="waiting" ? " pink-shadow" : " shadow-none")} onClick={() => setOnglet("waiting")}>En attente</Button>
                    <Button type={onglet=="add"?"full":"stroke"} style="popup" className={"mt-3" + (onglet=="add" ? " pink-shadow" : " shadow-none")} onClick={() => setOnglet("add")}>Ajouter</Button>
                </div>
                {onglet=="waiting" ?
                    <RequestFriends setFriends={setFriends} profileData={profileData as User}/>
                :
                    <AddFriends />

                }
            </div>

        </div>
    )
}
