import Button from "../../components/Button.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/ModalComponent.tsx";

type MenuFriendsParamComponentProps = {
    friendId: number;
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
    onClose: React.Dispatch<SetStateAction<boolean>>;
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function MenuFriendsParamComponent({onClose, friendId, setFriends} : MenuFriendsParamComponentProps) {

    const navigate = useNavigate();

    const handleNavToProfile = (idFriend: number) => {
        navigate(`/profile/${idFriend}`);
    }

    const handleBlockFriend = async (idFriend: number) => {
        const codeError = await Friend.blockFriends(idFriend);
        console.log("Code error : " + codeError);
    }

    const handleSupFriend = async (idFriend: number) => {
        const codeError = await Friend.deleteFriends(idFriend);
        console.log("Code error : " + codeError);
        
        try {
            const friends: Friend[] | undefined = await Friend.getFriends();
            if (friends != undefined)
            {
                // IL FAUT MODIFIER CA !

                friends.forEach(friend => {
                    friend.toggleConnected();
                    // il faut recuperer tout les messages ?
                });
                
                setFriends(friends);
            }
        } catch (error) {
            console.error("Erreur en récupérant les demandes d'ami :", error);
        }
    }

    // const [test, setTest] = useState(false);

    // const test1 = () => {
    //     console.log("oui");
    // };

    // const test2 = () => {
    //     console.log("non");
    // };

    return (
        <div className="relative z-999 top-5 right-18">
            <div className="fixed w-[100vw] h-[100vh] z-10 w-1/1 h-1/1 top-0 left-0 cursor-pointer" onClick={() => onClose(false)}></div>
            <div className="relative w-fit z-20 bg-dark border border-yellow rounded-md p-5 absolute pink-shadow">
                <p className="text-yellow w-[200px] cursor-pointer" onClick={() => handleNavToProfile(friendId)}>Profile</p>
                <div className="h-[1px] w-1/1 bg-dark-yellow mx-auto my-3"></div>
                <p className="text-yellow w-[200px] cursor-pointer" onClick={() => handleBlockFriend(friendId)}>Bloquer</p>
                <div className="h-[1px] w-1/1 bg-dark-yellow mx-auto my-3"></div>
                <p className="text-yellow w-[200px] cursor-pointer" onClick={() => handleSupFriend(friendId)}>Supprimer</p>
                {/* {test && <ModalComponent onClose={setTest} message={"truc"} onClickOption1={test1} onClickOption2={test2} />}
                <button onClick={() => setTest(true)}>test</button> */}
            </div>
        </div>
    )
}
