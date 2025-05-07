
import User from "./User";
import Message from "./Message";

class Friend extends User {
    messages: Message[];
    connected: boolean;
    nbNotifs: number;


    constructor(id: number, name: string, email: string, imageUrl: string, messages: Message[], connected: boolean, nbNotifs: number = 0) {
        super(id, name, email, imageUrl);
        
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
        !this.connected;
    }

    setNotif(newNbNotifs: number) {
        this.nbNotifs = newNbNotifs;
    }
    
    getUserInfo() {
        return `${super.getUserInfo()}, Messages: ${this.messages}, Connected ${this.connected}`;
    }
    
    static friendRequest(name: string)
    {
        // test
        console.log("test request for friend request");
        
        try {
            // tout les checks

            const requestData = {
                method :  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                { 
                    // body de la requete
                })
            }
            fetch('/api/chat/connect', requestData) // url a fetch
            .then(response => {
                console.log("response :");
                console.log(response);
                
                if (response.ok)
                {
                    // cas de reussite
                }
                else
                {
                    // cas d'erreur
                    console.log("C'est tliste");
                    
                }
            })

            // set toutes les erreurs a ""
        }
        catch(e) {
            console.error("Pas de chance !");
            console.error(e);
        }
    }

}



export default Friend;
