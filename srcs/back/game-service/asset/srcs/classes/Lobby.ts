import { WebSocket } from "ws";
import { sendLobbyData } from "../functions/sendLobbyData";

type id = number;

// errorCode need to be a 4 digits number
type errorCode = number

export class LobbyError extends Error {
    errorCode?: errorCode
    constructor(errorCode: errorCode)
    {
        super("LobbyError")
        this.errorCode = errorCode;
    }
}

export class LobbyUser {
    constructor (userId: id, websocket: WebSocket)
    {
        this.id = userId;
        this.websocket = websocket;
    }
    id: id;
    websocket: WebSocket;
}

export class Lobby
{
    static lobbies: Map<id, Lobby> = new Map();

    id: id;
    users: Array<LobbyUser> = new Array();
    authorizedIds: Array<id> = new Array();
    title: string;
    playerCount: number;
    ownerId?: number;

    constructor (playerCount: number, title: string, ownerId: id)
    {
        this.id = Lobby.lobbies.size;
        this.playerCount = playerCount;
        this.title = title;
        this.ownerId = ownerId;
        Lobby.lobbies.set(this.id, this);
    }

    invitePlayer(userId: number): void
    {
        if (this.authorizedIds.includes(userId))
            return;
        this.authorizedIds.push(userId);
    }

    playerJoin(userId: number, websocket: WebSocket): void
    {
        const authorizedUserId = this.authorizedIds.find(value => userId == value);
        if (!authorizedUserId && userId != this.ownerId)
            throw (new LobbyError(4003));
        const alreadyExistingUserId = this.users.find(user => user.id == userId);
        if (alreadyExistingUserId)
            throw (new LobbyError(4009));
        const lobbyUser = new LobbyUser(userId, websocket);
        this.users.push(lobbyUser);
        this.users.forEach(user => {
            if (!user)
                return ;
            user.websocket.send(JSON.stringify({ message: "playerJoinedLobby", userId: userId}));
            if (user.id != userId)
                sendLobbyData(user.websocket, this);
        });
    }

    playerLeave(userId: number)
    {
        this.users = this.users.filter(user => user.id !== userId);
        if (this.users.length <= 0)
            return this.deleteLobby();
        this.users.forEach(user => {
            if (!user)
                return ;
            user.websocket.send(JSON.stringify({ message: "playerLeftLobby", userId: userId}));
            if (user.id != userId)
                sendLobbyData(user.websocket, this);
        });
    }

    private deleteLobby()
    {
        Lobby.lobbies.delete(this.id);
    }

    checkIfCanBeLaunched(): void 
    {
        if (this.users.length != this.playerCount)
            throw (new LobbyError(4007));
        return ;
    }
}