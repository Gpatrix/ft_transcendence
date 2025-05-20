
import User from "./User";
import Message from "./Message";
import FriendRequest from "./FriendRequest";

const MESSAGE_RECIVED = 20;

class Friend extends User {
    // messages: Message[];
    connected: boolean;
    nbNotifs: number;



    constructor(id: number, name: string, email: string, profPicture: string, bio: string, lang : string,
            isTwoFactorEnabled : boolean, rank: number, connected: boolean = false, nbNotifs: number = 0) { // , messages: Message[] = []
        super(id, name, email, profPicture, bio, lang, isTwoFactorEnabled, rank);
        
        this.connected = connected;
        // this.messages = messages;
        this.nbNotifs = nbNotifs;
    }

    
    // addMessages(newMessages: Message) {
    //     this.messages.splice(0, 0, newMessages);
    // }
    
    // removeMessages(messagesToRemove: Message) {
    //     let index = this.messages.findIndex((message: Message) => message == messagesToRemove)
    //     this.messages.splice(index, 0);
    // }

    toggleConnected() {
        this.connected = !this.connected;
    }

    setNotif(newNbNotifs: number) {
        this.nbNotifs = newNbNotifs;
    }
    
    static async friendRequest(name: string) : Promise<number>
    {
        try {
            const requestData : RequestInit = {
                method :  'POST',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${encodeURIComponent(name)}`, requestData);

            // envoyer le json error plutot

        
            // console.log("Reponse HTTP :", response.status);

            return (response.status);
          } catch (error) {
            console.error("Erreur lors de l'envoi de la demande :", error);
            return (500);
          }
    }

    static async getFriendsRequest() : Promise<FriendRequest[] | undefined> {

        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/receivedFriendRequests`, requestData);
            
            console.log("Reponse HTTP :", response.status);
            
            const dataReponse = await response.json();

            const friendRequests: FriendRequest[] = dataReponse.map((req: any) =>
                new FriendRequest(req.authorId, new Date(req.createdAt), req.id, req.targetId)
            );
    
            for (const req of friendRequests) {
                await req.getAuthorRequest();
            }

            return (friendRequests)
        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande des requetes :", error);
            return (undefined);
        }
    }

    static async getFriends() : Promise<Friend[] | undefined> { //socket: WebSocket | null

        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends`, requestData);
            
            // console.log("Reponse HTTP :", response.status);

            // console.log(response);
            

            if (response.status / 100 != 2)
                return (undefined);
            
            const dataReponse = await response.json();

            // console.log(dataReponse);

            
            const friends : Friend[] = [];

            for (const req of dataReponse) {
                const user : User | undefined = await Friend.getUserById(req.friendUserId);

                // action: string;
                // targetId: number;
                // skip?: number;
                // take?: number;
                // msg?: string;

                // chercher ici tout les messages
                // console.log("debut de la recuperation de messge...");
                // if (user && socket && socket.readyState === WebSocket.OPEN) {
                //     try {
                //         let i = 0;
                //         let buffer = [];
                //         // console.log(user);
                //         do {
                //             console.log("recuperation de messge...");
                            
                            
                //             socket.send(JSON.stringify({ action: 'refresh', targetId: user.id, take: MESSAGE_RECIVED, skip: i * MESSAGE_RECIVED}));
                //             i++;
                //         } while (condition);
            
                //         // return (new Message(idSender, targetId, new Date(), message));
                //     } catch (error) {
                //         console.error("Erreur lors de l'envoi de la demande des requetes :", error);
                //     }
                // }
                
                if (user != undefined)
                    friends.push(new Friend(req.friendUserId, user.name, user.email, user.profPicture, user.bio, user.lang, user.isTwoFactorEnabled, user.rank));
            }
            

            return (friends);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande des requetes :", error);
            return (undefined);
        }
    }


    static async blockFriends(targetId: number) {

        try {
            const requestData : RequestInit = {
                method :  'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ targetId }),
            }
            const response = await fetch(`/api/user/blockUser`, requestData);
            
            console.log("Reponse HTTP :", response.status);
            
            return (response.status);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande des requetes :", error);
            return (500);
        }
    }

    // /api/user/friends/:id

    static async deleteFriends(targetId: number) {

        try {
            const requestData : RequestInit = {
                method :  'DELETE',
                credentials: 'include',
            }
            const response = await fetch(`/api/user/friends/${targetId}`, requestData);
            
            console.log("Reponse HTTP :", response.status);
            
            return (response.status);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande des requetes :", error);
            return (500);
        }
    }
}



export default Friend;
