// WebSocketComponent.tsx
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import Friend from '../../classes/Friend';
import Message from '../../classes/Message';
// import { WebSocketContext } from './WebSocketContext';



// Contexte :

// export const WebSocketContext = createContext<WebSocket | null>(null);


type WebSocketContextType = {
    socket: WebSocket | null;
    activFriend: number;
    setActivFriend: React.Dispatch<React.SetStateAction<number>>;
    friends : Friend[];
    setFriends : React.Dispatch<React.SetStateAction<Friend[]>>;
};



export const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    activFriend: 0,
    setActivFriend: () => {},
    friends :  [],
    setFriends : () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);




const WebSocketComponent = ({ children }: { children: ReactNode }) => {

    // on gere ici toutes les modifications dont on a besoin
    // mettre ici tout les amis avec tout les messages ???
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const [activFriend, setActivFriend] = useState<number>(0)
    const activFriendRef = useRef<number>(0);

    const [friends, setFriends] = useState<Friend[]>([]);
    const friendsRef = useRef<Friend[]>([]);

    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReconnect = useRef(true);

    const RECONNECT_INTERVAL = 500;

    const connectWebSocket = () => {
        const ws = new WebSocket('wss://localhost/api/chat/connect');

        ws.onopen = () => {
            console.log('WebSocket connecté');
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            console.log('Message reçu:', event.data);
            const data = JSON.parse(event.data);

            if (ws && ws.readyState === WebSocket.OPEN) {
                const newMessage = new Message(data.senderId, -1, new Date(data.sentAt), data.content)
                if (newMessage != undefined) {
                    const newFriends = [...friendsRef.current];
                    const friend = newFriends.find((friend) => friend.id == data.senderId);
                    if (friend) {
                        friend.addMessages(newMessage);
                        if (friend.id != activFriendRef.current)
                            friend.nbNotifs++;
                        setFriends(newFriends);
                    }
                }
           } else {
               console.warn('Socket non connectée');
           }
        };

        ws.onclose = () => {
            console.log('WebSocket fermé');
            if (shouldReconnect.current) {
                console.log(`Tentative de reconnexion dans ${RECONNECT_INTERVAL / 1000}s...`);
                reconnectTimeout.current = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
            }
        };

        ws.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
            ws.close(); // Forcer une fermeture pour relancer la reconnexion
        };
    };

    useEffect(() => {
        // WebSocketContext.set = setFriends;

        connectWebSocket();
    }, []);

    useEffect(() => {
        friendsRef.current = friends;
    }, [friends]);

    useEffect(() => {
        activFriendRef.current = activFriend;
    }, [activFriend]);

    // ce au'on vas recuperer dans les enfants :
    // value={{ socket, lastMessage }}
    // faire const { lastMessage } = useWebSocket(); pour recupere lastMessage par exemple

    return (
        <WebSocketContext.Provider value={{ socket, friends, setFriends, activFriend, setActivFriend }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketComponent;
