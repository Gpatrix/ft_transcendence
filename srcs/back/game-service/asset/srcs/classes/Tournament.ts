import { setTimeout } from "timers";

class Lobby {
    constructor (id: number, authorizedIds: Array<number>, title: string, playerCount: number)
    {
        this.id = id;
        this.authorizedIds = authorizedIds;
        this.title = title;
        this.playerCount = playerCount;
    }
    id: number;
    authorizedIds: Array<number>;
    title: string;
    playerCount: number;
}

class TournamentUser {
    constructor (id: number, websocket: WebSocket)
    {
        this.id = id;
        this.websocket = websocket;
    }
    id: number;
    websocket: WebSocket;
}

class Tournament
{
    static tournaments: Map<number, Tournament> = new Map();

    id: number;
    authorizedIds: Array<number>;
    title: string;
    playerCount: number;
    constructor (id: number, authorizedIds: Array<number>, playerCount: number, title: string)
    {
        this.id = id;
        this.authorizedIds = authorizedIds;
        this.playerCount = playerCount;
        this.title = title;
    }

    async invitePlayer(playerId: number): Promise<void>
    {
        if (this.authorizedIds.includes(playerId))
            return;
        this.authorizedIds.push(playerId);
    }

    async addUserTournament(user: TournamentUser): Promise<TournamentUser[] | undefined>
    {
        this.push(user);
        if (this.length == this.playerCount)
        {
            await new Promise(resolve => setTimeout(resolve, 1 * 1000)); // Wait for other players to join
            return (this.extractUsers());
        }
        else if (this.length > this.playerCount)
            return (this.extractUsers());
        else
            return (undefined);
    }

    async private wait
}

module.exports = {
    PrivateMatchUser,
    PrivateMatch
}