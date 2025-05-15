import { setTimeout } from "timers";

export class MatchMakingUser {
    constructor (id: number, rank: number, websocket: WebSocket)
    {
        this.id = id;
        this.rank = rank;
        this.waitFrom = new Date(Date.now());
        this.websocket = websocket;
    }
    id: number;
    rank: number;
    waitFrom: Date;
    websocket: WebSocket;
}

export class MatchMakingMap extends Array<MatchMakingUser>
{
    private playerCount: number = 2;

    private extractUsers(): MatchMakingUser[] {
        const firstUser: MatchMakingUser = this[0];
        let result = this
        result
            .map(p => ({ ...p, diff: Math.abs(p.rank - firstUser.rank) }))
            .sort((a, b) => a.diff - b.diff)
            .slice(0, this.playerCount)
            .map(entry => entry as MatchMakingUser)
            .concat(firstUser);
        this.slice(this.playerCount, this.length);
        return (result);
    }

    async addUserToMatchmaking(user: MatchMakingUser): Promise<MatchMakingUser[] | undefined>
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
}

module.exports = {
    MatchMakingUser,
    MatchMakingMap
}