import { SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../Auth/WebSocketComponent.tsx";
import { gpt } from "../../translations/pages_reponses"
import { get_server_translation } from "../../translations/server_responses.tsx";

type MenuFriendsParamComponentProps = {
    friendId: number;
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
    onClose: React.Dispatch<SetStateAction<boolean>>;
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function MenuFriendsParamComponent({ onClose, friendId, setFriends } : MenuFriendsParamComponentProps) {

    const navigate = useNavigate();

    const { socket } = useWebSocket();
    
    const handleNavToProfile = (idFriend: number) => {
        navigate(`/profile/${idFriend}`);
    }

    const handleBlockFriend = async (idFriend: number) => {
        const codeError : string = await Friend.blockFriends(idFriend);
            
    }

    const handleSupFriend = async (idFriend: number) => {
        const codeError = await Friend.deleteFriends(idFriend);
        if (codeError != "200") {
            return ;
        }
        
        try {
            if (socket)
                socket.send(JSON.stringify({ action: 'deleteFriend', targetId: idFriend}));
            const friends: Friend[] | string = await Friend.getFriends();
            if (typeof friends != 'string')
            {
                // IL FAUT MODIFIER CA !

                friends.forEach(friend => {
                    friend.toggleConnected();
                });
                
                setFriends(friends);
            }
        } catch (error) {
            
        }
    }

    // const [test, setTest] = useState(false);

    // const test1 = () => {
    //     
    // };

    // const test2 = () => {
    //     
    // };

    return (
        <div className="relative z-999 top-5 right-18">
            <div className="fixed w-[100vw] h-[100vh] z-10 w-1/1 h-1/1 top-0 left-0 cursor-pointer" onClick={() => onClose(false)}></div>
            <div className="relative w-fit z-20 bg-dark border border-yellow rounded-md p-5 absolute pink-shadow">
                <p className="text-yellow w-[200px] cursor-pointer" onClick={() => handleNavToProfile(friendId)}>{gpt("profile")}</p>
                <div className="h-[1px] w-1/1 bg-dark-yellow mx-auto my-3"></div>
                <p className="text-yellow w-[200px] cursor-pointer" onClick={() => handleBlockFriend(friendId)}>{gpt("to_block")}</p>
                <div className="h-[1px] w-1/1 bg-dark-yellow mx-auto my-3"></div>
                <p className="text-yellow w-[200px] cursor-pointer" onClick={() => handleSupFriend(friendId)}>{gpt("unfriend")}</p>
                {/* {test && <ModalComponent onClose={setTest} message={"truc"} onClickOption1={test1} onClickOption2={test2} />}
                <button onClick={() => setTest(true)}>test</button> */}
            </div>
        </div>
    )
}
