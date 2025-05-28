// WebSocketComponent.tsx
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import Friend from '../../classes/Friend';
import Message from '../../classes/Message';
import { useLocation } from 'react-router-dom';
// import { WebSocketContext } from './WebSocketContext';



// Contexte :

// export const WebSocketContext = createContext<WebSocket | null>(null);

interface messageData
{
    channelId: number,
    content: string,
    senderId: number,
    sentAt: string,
}


type WebSocketContextType = {
    socket: WebSocket | null;
    activFriend: number;
    setActivFriend: React.Dispatch<React.SetStateAction<number>>;
    friends : Friend[];
    setFriends : React.Dispatch<React.SetStateAction<Friend[]>>;
    arrayMessage: Message[];
    setArrayMessage : React.Dispatch<React.SetStateAction<Message[]>>;
};



export const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    activFriend: 0,
    setActivFriend: () => {},
    friends :  [],
    setFriends : () => {},
    arrayMessage: [],
    setArrayMessage: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);





const WebSocketComponent = ({ children }: { children: ReactNode }) => {

    // on gere ici toutes les modifications dont on a besoin
    // mettre ici tout les amis avec tout les messages ???
    const location = useLocation();

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const [activFriend, setActivFriend] = useState<number>(0)
    const activFriendRef = useRef<number>(-1);

    const [friends, setFriends] = useState<Friend[]>([]);
    const friendsRef = useRef<Friend[]>([]);

    const [arrayMessage, setArrayMessage] = useState<Message[]>([]);
    const arrayMessageRef = useRef<Message[]>([]);

    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReconnect = useRef(true);

    const RECONNECT_INTERVAL = 500;

    const connectWebSocket = () => {
        const ws = new WebSocket('wss://localhost/api/chat/connect');

        ws.onopen = () => {
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            if (event.data) {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        if (data.action)
                        {
                            Friend.getFriends().then((newFriends) => {
                                if (newFriends != undefined)
                                {
                                    // IL FAUT MODIFIER CA !
                                    newFriends.forEach(friend => {
                                        friend.toggleConnected();
                                    });
                                    setFriends(newFriends);
                                }
                            })
                        } else if (data.messages) {
                            // verrifier le chanel de discution ?
                            const newArrayMessage = [...arrayMessageRef.current];
                            const newMessages: Message[] = (data.messages as Array<messageData>).map(message => 
                                new Message(message.senderId, -1, new Date(message.sentAt), message.content)
                            )
                            newArrayMessage.splice(data.skipped, 20, ...newMessages);
                            setArrayMessage(newArrayMessage);
                        } else {
                            const newMessage = new Message(data.senderId, -1, new Date(data.sentAt), data.content)
                            if (newMessage != undefined) {
                                if (newMessage.idSender == activFriendRef.current) {
                                    const newArrayMessage = [...arrayMessageRef.current];
                                    newArrayMessage.splice(0, 0, newMessage);
                                    setArrayMessage(newArrayMessage);
                                } else {
                                    const newFriends = [...friendsRef.current];
                                    const friend = newFriends.find((friend) => friend.id == data.senderId);
                                    if (friend) {
                                        friend.nbNotifs++;
                                        setFriends(newFriends);
                                    }
                                }
                            }
                        }
                    } else {
                        console.warn('Socket non connectée');
                    }
                } catch (error) {
                    console.error("Error :", error);
                }
            }
        };

        ws.onclose = () => {
            if (shouldReconnect.current) {
                reconnectTimeout.current = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
            }
        };

        ws.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
            ws.close(); // Forcer une fermeture pour relancer la reconnexion
        };
    };


    const fetchFriends = async () => {
        try {
            const tempFriends: Friend[] | undefined = await Friend.getFriends();
            if (tempFriends != undefined)
            {
                // IL FAUT MODIFIER CA !

                tempFriends.forEach(friend => {
                    friend.toggleConnected();
                });
        
                // setFriends(newFriends.map(friend => {
                //     const updatedFriend = new Friend(friend.id, ...);
                //     updatedFriend.toggleConnected();
                //     return updatedFriend;
                // }));
                await setFriends(tempFriends);
                if (tempFriends[0])
                    await setActivFriend(tempFriends[0].id);
                return (tempFriends);
            }
        } catch (error) {
            console.error("Error :", error);
        }
    };

    useEffect(() => {
        connectWebSocket();
    }, []);

    useEffect(() => {
        friendsRef.current = friends;
    }, [friends]);

    useEffect(() => {
        arrayMessageRef.current = arrayMessage;
    }, [arrayMessage]);

    useEffect(() => {
        activFriendRef.current = activFriend;
        if (socket)
            socket.send(JSON.stringify({ action: 'refresh', targetId: activFriend, take:20, skip:0}));
    }, [activFriend]);

    useEffect(() => {
        
        if (socket)
            fetchFriends();
    }, [socket])

    return (
        <WebSocketContext.Provider value={{ socket, friends, setFriends, activFriend, setActivFriend, arrayMessage, setArrayMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketComponent;
