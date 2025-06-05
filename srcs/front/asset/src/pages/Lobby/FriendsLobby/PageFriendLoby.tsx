
import { MouseEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useAuth } from "../../../AuthProvider";
import User from "../../../classes/User";
import { useWebSocket } from "../../Auth/WebSocketComponent";
import UserContact from "../../../components/UserContact";
import Friend from "../../../classes/Friend";
import Chat from "../../Chat/Chat";
import Message from "../../../classes/Message";
import ProfilePic from "../../../components/ProfilePic";
import Button from "../../../components/Button";

export default function PageFriendLoby() {
    // const [params] = useSearchParams()
    const navigate = useNavigate()

    const { fetchWithAuth } = useAuth();

    const { friends } = useWebSocket();
    const friendsRef = useRef<Friend[]>([]); // a supprimer ?
    
    const [profileData, setProfileData] = useState<Friend | undefined>(undefined)
    const profileDataRef = useRef<Friend>(undefined);
    const [arrayPlayers, setArrayPlayers] = useState<Friend[]>([])
    const arrayPlayersRef = useRef<Friend[]>([]);
    
    const [arrayFriends, setArrayFriends] = useState<Friend[]>([])
    const arrayFriendsRef = useRef<Friend[]>([]);

    const [errorMessage, setErrorMessage] = useState<string>("")

    
    // const [arrayPlayers, setArrayPlayers] = useState<User[]>([])

    
    // async function joinGame() {
    //     if (params.get("gameId"))
    //         alert("gameID")
    //     else {
    //         navigate("/lobby/friends/create")
    //     }
    // }

    function getUserParams() {
        fetchWithAuth(`/api/user/get_profile/`)
        .then((response) => response.json())
        .then((json) => {
            if (json.data)
            {
                const data = json.data
                
                setProfileData(new Friend(data.id, data.name, data.email, data.profPicture, data.bio, data.lang, data.isTwoFactorEnabled, data.rank, true));
                return(true);
            }
        })
        .catch((error) => {
            console.log("Error :", error);
        });
    }
    // function getUserParams() {
    //     fetchWithAuth(`/api/user/get_profile/`)
    //         .then((response) => response.json())
    //         .then((json) => {
    //             const data = json.data
    //             setProfileData(prev => ({
    //                 ...prev,
    //                 name: data.name,
    //                 email: data.email,
    //                 bio: data.bio,
    //                 profPicture: data.profPicture,
    //                 rank: data.rank,
    //                 lang: data.lang,
    //                 isTwoFactorEnabled : data.isTwoFactorEnabled
    //             }));
    //         })
    //         .catch((error) => {
    //             console.error("Error :", error);
    //         });
    // }

    const handleFriendsChange = (friends: Friend[]) => {
        const newFriends: Friend[] = [...friends];

        const newArrayPlayers: Friend[] = [...arrayPlayersRef.current];

        arrayPlayersRef.current.forEach(player => {
            const friendIndex = newFriends.findIndex(friend => friend == player)
            const playerIndex = newArrayPlayers.findIndex(newPlayer => newPlayer == player)
            if (friendIndex != -1)
                newFriends.splice(friendIndex, 1);
            else if (player.id != profileDataRef.current?.id)
                newArrayPlayers.splice(playerIndex, 1);
        });

        setArrayFriends(newFriends)
        setArrayPlayers(newArrayPlayers)
    }

    // const handleClickIcone = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const handleAddFriend: React.MouseEventHandler<HTMLButtonElement> = (e) => {

        if (arrayPlayersRef.current.length >= 4)
            return ;
        
        let balise: HTMLButtonElement = e.currentTarget.parentElement as HTMLButtonElement;
        const newArrayFriends: Friend[] = [...arrayFriendsRef.current];
        if (balise.dataset.nb)
        {
            const friendindex = newArrayFriends.findIndex(friend => friend.id == Number(balise.dataset.nb))
            if (friendindex != -1) {
                const newPlayer: Friend = newArrayFriends.splice(friendindex, 1)[0];
                const newArrayPlayers = [...arrayPlayersRef.current];
                newArrayPlayers.push(newPlayer);
                
                setArrayFriends(newArrayFriends)
                setArrayPlayers(newArrayPlayers)
            }
        }
    }

    const handleSuppFriend: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        let balise: HTMLButtonElement = e.currentTarget.parentElement as HTMLButtonElement;
        const newArrayPlayers: Friend[] = [...arrayPlayersRef.current];
        if (balise.dataset.nb)
        {
            const friendindex = newArrayPlayers.findIndex(friend => friend.id == Number(balise.dataset.nb))
            if (friendindex != -1) {
                const newFriend: Friend = newArrayPlayers.splice(friendindex, 1)[0];
                const newArrayFriends = [...arrayFriendsRef.current];
                newArrayFriends.push(newFriend);
                newArrayFriends.sort((friend1, friend2) => (friend1.id < friend2.id) ? -1 : 1)
                
                setArrayFriends(newArrayFriends)
                setArrayPlayers(newArrayPlayers)
            }
        }
    }

    const handlePlayGame = async () => {
        if (arrayPlayersRef.current.length != 2
            && arrayPlayersRef.current.length != 4) {
            setErrorMessage("Vous devez etre 2 ou 4 pour lancer une partie"); // traduire cette merde !
            return ;
        } else {
            setErrorMessage("");
            const tabIds = arrayPlayersRef.current.map(player => player.id);
            // creer partie :
            // const requestData : RequestInit = {
            //     method :  'post',
            //     credentials: 'include'
            // }
            const requestData: RequestInit = {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userIds: tabIds
                })
            };
            const test = await fetch("/api/game/friendMatch/create", requestData);
            console.log(test);
            const data = await test.json();
            console.log(data);
            
        }

        // inviter les gents et attendre qu'ils rejoingne la game

    }

    useEffect(() => {
        getUserParams()
    }, [])

    useEffect(() => {
        profileDataRef.current = profileData;
        if (arrayPlayers.length == 0 && profileData != undefined)
            arrayPlayers.push(profileData);
    }, [profileData])

    useEffect(() => {
        friendsRef.current = friends;
        handleFriendsChange(friends);
    }, [friends])

    useEffect(() => {
        arrayFriendsRef.current = arrayFriends;
    }, [arrayFriends])

    useEffect(() => {
        arrayPlayersRef.current = arrayPlayers;
    }, [arrayPlayers])

    // useEffect(()=> {
    //     // joinGame()
    // }, [params])

    return (
        <div className="w-1/1 h-1/1 flex flex-col items-center">
            <div className="w-1/1 flex justify-evenly">
                
                <div className="flex flex-col pt-3 gap-3 overflow-y-scroll h-1/1 p-3 w-1/4 items-center">
                    <div className="order-first text-yellow font-press text-center">Player</div>
                    {arrayPlayers.map((friend, id) => {
                        if (friend.id != profileData?.id)
                            return <UserContact key={id} nb={friend.id}
                            type='nonactive'
                            status={friend.connected ? 'online' : 'offline'}
                            className={friend.connected ? 'order-first' : ''}
                            userName={friend.name}
                            image={friend.profPicture}
                            notifs={friend.nbNotifs}
                            onClickIcone={handleSuppFriend}
                            iconeType="supp"
                            />;
                        else
                            return <UserContact key={id} nb={friend.id}
                                type='nonactive'
                                status={friend.connected ? 'online' : 'offline'}
                                className={friend.connected ? 'order-first' : ''}
                                userName={friend.name}
                                image={friend.profPicture}
                                notifs={friend.nbNotifs}
                            />;
                    })}
                    
                </div>


                <div className="flex flex-col pt-3 gap-3 overflow-y-scroll h-1/1 p-3 w-1/4">
                    <div className="order-first text-yellow font-press text-center">Friends</div>
                    {arrayFriends.map((friend, id) => {
                        if (friend.connected)
                            return <UserContact key={id} nb={friend.id}
                                type='nonactive'
                                status={friend.connected ? 'online' : 'offline'}
                                className={friend.connected ? 'order-first' : ''}
                                userName={friend.name}
                                image={friend.profPicture}
                                notifs={friend.nbNotifs}
                                onClickIcone={handleAddFriend}
                            />;
                        else
                            return ""
                    })}
                </div>
                {/* <div className="w-1/2 flex flex-col item-center">
                    <div className="flex justify-center h-[50px]">
                        {arrayPlayers.map(player => {
                            if (player != undefined)
                                return <ProfilePic className={''} profileLink='' image={player.profPicture} />
                            else
                                return ""
                        })}
                    </div>
                    {profileData && <Chat blur={false} profileData={profileData} participants={[]} arrayMessage={[]} setArrayMessage={function (value: SetStateAction<Message[]>): void {
                        throw new Error("Function not implemented.");
                    } } />}
                </div> */}
            </div>


            {/* traduite cette chose */}
            <Button onClick={handlePlayGame} className="mt-auto w-fit" style={location.pathname=="/profil"?'selected':'header'}>Lancer la partie</Button>
            {errorMessage && <div className="text-light-red">{errorMessage}</div>}
        </div>
    )
}
