
import User from "./User";
import Message from "./Message";
import FriendRequest from "./FriendRequest";

const MESSAGE_RECIVED = 20;

// pour prisma :
// pnpx prisma studio

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
    
    static async friendRequest(id: number) : Promise<string>
    {
        try {
            const requestData : RequestInit = {
                method :  'POST',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${id}`, requestData);

            if (response.status)
                return (String(response.status))
                
			const dataReponse = await response.json();
            return (dataReponse.error);
          } catch (error) {
            console.log("Erreur lors de l'envoi de la demande :", error);
            
            return ("500");
          }
    }

    static async getFriendsRequest() : Promise<FriendRequest[] | string> {

        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/receivedFriendRequests`, requestData);
            
            
            const dataReponse = await response.json();

            if (dataReponse.error)
                return dataReponse.error

            const friendRequests: FriendRequest[] = dataReponse.map((req: any) =>
                new FriendRequest(req.authorId, new Date(req.createdAt), req.id, req.targetId)
            );
    
            for (const req of friendRequests) {
                await req.getAuthorRequest();
            }

            return (friendRequests)
        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande des requetes :", error);
            return ("0500");
        }
    }

    static async getFriends() : Promise<Friend[] | string> { //socket: WebSocket | null

        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends`, requestData);

            const dataReponse = await response.json();
            
            if (dataReponse.error)
                return (dataReponse.error)
            
            const friends : Friend[] = [];

            for (const req of dataReponse) {
                const userRes : User | string = await Friend.getUserById(req.friendUserId);

                if (typeof userRes == "string")
                    return (userRes)
                else
                    friends.push(new Friend(req.friendUserId, userRes.name, userRes.email, userRes.profPicture, userRes.bio, userRes.lang, userRes.isTwoFactorEnabled, userRes.rank));
            }
            return (friends);

        } catch (error) {
            return ("0500");
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
            
            
            return (response.status);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande des requetes :", error);
            return (500);
        }
    }
}

export default Friend;
