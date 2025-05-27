import User from "./User";

class Player extends User {
    points: number;
    idGame: number;
    place: number;
    // id: number, name: string, email: string, profPicture:string, bio:string, rank: number
    constructor(id: number, name: string, email: string, profPicture: string, bio: string, lang : string, isTwoFactorEnabled : boolean, rank: number, points: number, idGame: number, place: number) {
        super(id, name, email, profPicture, bio, lang, isTwoFactorEnabled, rank);
        
        this.idGame = idGame;
        this.points = points;
        this.place = place;
    }
    
    addPoints(newPoints: number) {
        this.points += newPoints;
    }
    
    removePoints(pointsToRemove: number) {
        this.points = Math.max(0, this.points - pointsToRemove);
    }
    
    getUserInfo() {
        return `${super.getUserInfo()}, Points: ${this.points}`;
    }

    static findUserById(players: Player[], userId: number): Player | undefined {
        return players.find(user => user.id === userId);
    }
}

export default Player;
