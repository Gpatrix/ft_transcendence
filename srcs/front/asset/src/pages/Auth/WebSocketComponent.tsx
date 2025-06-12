// WebSocketComponent.tsx
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import Friend from '../../classes/Friend';
import Message from '../../classes/Message';
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

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const [activFriend, setActivFriend] = useState<number>(0)
    const activFriendRef = useRef<number>(-1);

    const [friends, setFriends] = useState<Friend[]>([]);
    const friendsRef = useRef<Friend[]>([]);

    const [arrayMessage, setArrayMessage] = useState<Message[]>([]);
    const arrayMessageRef = useRef<Message[]>([]);

    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReconnect = useRef(true);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    const RECONNECT_INTERVAL = 500;

    const connectWebSocket = () => {

        const ws = new WebSocket(`wss://${window.location.host}/api/chat/connect`);

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
                                if (typeof newFriends != 'string')
                                    setFriends(newFriends);
                            })
                        } else if (data.messages) {
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
                                }
                                if (location.pathname!="/chat") {
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
                    
                }
            }
        };

        ws.onclose = async () => {
            if (shouldReconnect.current) {
                if (intervalRef.current != null)
                    clearInterval(intervalRef.current);

                const requestData : RequestInit = {
                    method :  'GET',
                    credentials: 'include'
                }
                reconnectTimeout.current = await setTimeout(async ()=>{
                    const response = await fetch(`/api/auth/status`, requestData);
                    if (response.status == 200) {
                        checkConnectedFriends();
                        connectWebSocket();
                        
                    }
                }, RECONNECT_INTERVAL);
            }
        };

        ws.onerror = () => {
            
            ws.close(); // Forcer une fermeture pour relancer la reconnexion
        };
    };


    const fetchFriends = async () => {
        try {
            const tempFriends: Friend[] | string = await Friend.getFriends();
            if (typeof tempFriends != 'string')
            {
                setFriends(tempFriends);
                if (tempFriends[0])
                    setActivFriend(tempFriends[0].id);
                return (tempFriends);
            } else {
                
            }
        } catch (error) {
            
        }
    };

    const checkConnectedFriends = () => {
        const requestData : RequestInit = {
            method :  'GET',
            credentials: 'include'
        }
        if (intervalRef.current == null) {

            intervalRef.current = setInterval(async function() {
                const newFriends : Friend[] = friendsRef.current.map(friend =>
                    new Friend(friend.id, friend.name, friend.email, friend.profPicture, friend.bio, friend.lang, friend.isTwoFactorEnabled, friend.rank, friend.connected));
                
                for (const friend of newFriends) {

                    const friendCur =  friendsRef.current.find(friendCur => friend.id == friendCur.id);
                    if (friendCur)
                        friend.nbNotifs = friendCur.nbNotifs;
                    const response = await fetch(`/api/chat/isconnected/${friend.id}`, requestData);
                    const dataReponse = await response.json();
                    
                    if (dataReponse.value != friend.connected)
                        friend.toggleConnected();
                }
                if (JSON.stringify(newFriends) != JSON.stringify(friendsRef.current))
                    setFriends(newFriends);
            }, 3000);
        }
    }

    useEffect(() => {
        connectWebSocket();
        checkConnectedFriends();
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
