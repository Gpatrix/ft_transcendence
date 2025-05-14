import User from "./User";

class HistoryPlayer extends User {
  points: number;
  idGame: number;
  place: number;

  constructor(
    id: number,
    name: string,
    email: string,
    profPicture: string,
    bio: string,
    lang: string,
    isTwoFactorEnabled: boolean,
    rank: number,
    points: number,
    idGame: number,
    place: number
  ) {
    super(id, name, email, profPicture, bio, lang, isTwoFactorEnabled, rank);
    this.points = points;
    this.idGame = idGame;
    this.place = place;
    this.profPicture = profPicture;
  }

  addPoints(newPoints: number): void {
    this.points += newPoints;
  }

  removePoints(pointsToRemove: number): void {
    this.points = Math.max(0, this.points - pointsToRemove);
  }

  getUserInfo(): string {
    return `${super.getUserInfo()}, Points: ${this.points}`;
  }

  static findUserById(players: HistoryPlayer[], userId: number): HistoryPlayer | undefined {
    return players.find(player => player.id === userId);
  }

  static async fillFromApi(
    userId: number,
    points: number,
    idGame: number,
    place: number
  ): Promise<HistoryPlayer> {
    const res = await fetch(`/api/user/get_profile/${userId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch user with id ${userId}`);
    }

    const json = await res.json();
    const data = json.data;
    console.log(data)
    return new HistoryPlayer(
      userId,
      data.name,
      data.email,
      data.profPicture,
      data.bio,
      data.lang,
      data.isTwoFactorEnabled,
      data.rank,
      points,
      idGame,
      place
    );
  }
}

export default HistoryPlayer;
