
import User from "./User";

class Player extends User {
    points: number;
    idGame: number;
    place: number;
    id: number;

    constructor(id: number, name: string, email: string, imageUrl: string, points: number, idGame: number, place: number) {
        super(id, name, email, imageUrl);
        
        this.idGame = idGame;
        this.points = points;
        this.place = place;
        this.id = id
    }
    
    static async fillFromApi(userId: number, points: number, idGame: number, place: number): Promise<Player> {
        const res = await fetch(`/api/user/get_profile/${userId}`);
        if (!res.ok) throw new Error(`Failed to fetch user with id ${userId}`);
        
        const data = await res.json();
        
        return new Player(data.id, data.name, data.email, data.imageUrl, points, idGame, place);
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
        console.log(players);
        
        return players.find(user => user.id === userId);
      }
}



export default Player;
