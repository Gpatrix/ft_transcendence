import User from "./User";

class Player extends User {
<!--   points: number;
  idGame: number;
  place: number;

  constructor(
    id: number,
    name: string,
    email: string,
    imageUrl: string,
    points: number,
    idGame: number,
    place: number
  ) {
    super(id, name, email, imageUrl);
    this.points = points;
    this.idGame = idGame;
    this.place = place;
  }

  static async fillFromApi(
    userId: number,
    points: number,
    idGame: number,
    place: number
  ): Promise<Player> {
    const res = await fetch(`/api/user/get_profile/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch user with id ${userId}`);

    const json = await res.json();
    const data = json.data; -->
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
        console.log(players);
        
        return players.find(user => user.id === userId);
      }
}

    const test = new Player(
      userId,
      data.name,
      data.email,
      data.profPicture,
      points,
      idGame,
      place
    );
    console.log(test)
    return (test)
  }

  addPoints(newPoints: number) {
    this.points += newPoints;
  }

  removePoints(pointsToRemove: number) {
    this.points = Math.max(0, this.points - pointsToRemove);
  }

  getUserInfo(): string {
    return `${super.getUserInfo()}, Points: ${this.points}`;
  }

  static findUserById(players: Player[], userId: number): Player | undefined {
    return players.find((user) => user.id === userId);
  }
}

export default Player;
