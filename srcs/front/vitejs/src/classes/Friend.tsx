
import User from "./User";
import Message from "./Message";
import FriendRequest from "./FriendRequest";

class Friend extends User {
    messages: Message[];
    connected: boolean;
    nbNotifs: number;


    constructor(id: number, name: string, email: string, profPicture: string, bio: string, rank: number, messages: Message[] = [], connected: boolean = false, nbNotifs: number = 0) {
        super(id, name, email, profPicture, bio, rank);
        
        this.connected = connected;
        this.messages = messages;
        this.nbNotifs = nbNotifs;
    }

    
    addMessages(newMessages: Message) {
        this.messages.push(newMessages);
    }
    
    removeMessages(messagesToRemove: Message) {
        let index = this.messages.findIndex((message: Message) => message == messagesToRemove)
        this.messages.splice(index, 0);
    }

    toggleConnected() {
        this.connected = !this.connected;
    }

    setNotif(newNbNotifs: number) {
        this.nbNotifs = newNbNotifs;
    }
    
    getUserInfo() {
        return `${super.getUserInfo()}, Messages: ${this.messages}, Connected ${this.connected}`;
    }
    
    static async friendRequest(name: string) : Promise<number>
    {
        try {
            const requestData : RequestInit = {
                method :  'POST',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${encodeURIComponent(name)}`, requestData);
        
            console.log("Reponse HTTP :", response.status);

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

    static async getFriends() : Promise<Friend[] | undefined> {

        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends`, requestData);
            
            console.log("Reponse HTTP :", response.status);

            if (response.status / 100 != 2)
                return (undefined);
            
            const dataReponse = await response.json();
            
            const friends : Friend[] = [];

            for (const req of dataReponse) {
                const user : User | undefined = await Friend.getUserById(req.friendUserId);
                
                if (user != undefined)
                    friends.push(new Friend(req.friendUserId, user.name, user.email, user.profPicture, user.bio, user.rank));
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
