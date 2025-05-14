import User from "./User";

class FriendRequest {
    authorId: number;
    createdAt: Date;
    id: number;
    targetId: number;
    author: User | undefined;


    constructor(authorId: number, createdAt: Date, id: number, targetId: number) {
        
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.id = id;
        this.targetId = targetId;
        this.author = undefined;

    }

    async getAuthorRequest() {
        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/get_profile/${this.authorId}`, requestData);

            const dataReponse = await response.json();
            
            this.author = dataReponse.data as User;
            // return (dataReponse);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande :", error);
            this.author = undefined;
            // return (undefined);
        }
    }
    
    // '/api/user/friends/requests/:id' delete
    async refuseRequest() {
        try {
            const requestData : RequestInit = {
                method :  'DELETE',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${this.id}`, requestData);

            console.log(response.status);
            return (response.status); // return le status ?

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande :", error);
            this.author = undefined;
            return (500);
        }
    }

    async accepteRequest() {
        try {
            const requestData : RequestInit = {
                method :  'PUT',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${this.id}`, requestData);

            console.log(response);
            // const dataReponse = await response.json();
            // console.log(dataReponse);
            
            
            // this.author = dataReponse.data as User;
            // return (dataReponse);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande :", error);
            this.author = undefined;
            // return (undefined);
        }
    }

}



export default FriendRequest;
