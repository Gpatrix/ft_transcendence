
import User from "./User";

class Invitation extends User {
    approuved: boolean;

    constructor(id: number, name: string, email: string, imageUrl: string, approuved: boolean) {
        super(id, name, email, imageUrl);
        
        this.approuved = approuved;
    }

    approuve()
    {
        this.approuved = true;
        // requeter le back
    }

    getUserInfo() {
        return `${super.getUserInfo()}, Approuved: ${this.approuved}`;
    }
}

export default Invitation;
