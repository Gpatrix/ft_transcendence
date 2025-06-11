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

    async getAuthorRequest() : Promise<string>  {
        try {
            const requestData : RequestInit = {
                method :  'GET',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/get_profile/${this.authorId}`, requestData);

            const dataReponse = await response.json();

            if (dataReponse.error)
                return (dataReponse.error)
            
            this.author = dataReponse.data as User;
            
            return ("200");

        } catch (error) {
            this.author = undefined;
            return ("0500");
        }
    }
    
    async refuseRequest() : Promise<string> {
        try {
            const requestData : RequestInit = {
                method :  'DELETE',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${this.id}`, requestData);

            if (response.status == 200)
                return ("200")

            const dataReponse = await response.json();

            return (dataReponse.error);

        } catch (error) {
            return ("0500");
        }
    }

    async accepteRequest() {
        try {
            const requestData : RequestInit = {
                method :  'PUT',
                credentials: 'include'
            }
            const response = await fetch(`/api/user/friends/requests/${this.id}`, requestData);
            if (response.status == 200)
                    return ("200")
            const dataReponse = await response.json();
            return (dataReponse.error)
        } catch (error) {
            this.author = undefined;
            console.log(error);
            
            return ("0500")
        }
    }

}



export default FriendRequest;
