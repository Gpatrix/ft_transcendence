import WebSocket from 'ws';

async function userLookup(userId: number) {
    const userLookupResponse = await fetch(`http://user-service:3000/api/user/lookup/${userId}`,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            credential: process.env.API_CREDENTIAL
        }),
    });
    const userLookupData = await userLookupResponse.json();
    if (!userLookupResponse.ok)
        return (null);
    return (userLookupData);
}

interface LobbyDataUserStruct {
    id: number;
    name: string;
    rank: number;
    profPicture: string;
}

interface LobbyDataStruct {
    id: number;
    title: string;
    playersCount: number;
    users: Array<LobbyDataUserStruct>;
    ownerId: number;
}

export async function sendLobbyData(websocket: WebSocket, lobby: Lobby)
{
    const lobbyUsers: Array<LobbyDataUserStruct> = await Promise.all(lobby.users.map(async (user: any) => {
        const userData = await userLookup(user.id);
        if (!userData) {
            return ({
                id: user.id,
                name: `Player ${user.id}`,
                rank: 0,
                profPicture: null,
            });
        }
        else {
            return ({
                id: user.id,
                name: userData.name,
                rank: userData.rank,
                profPicture: userData.profilePicture,
            });
        }
    }));
    const lobbyData: LobbyDataStruct = {
        id: lobby.id,
        title: lobby.title,
        playersCount: lobby.playerCount,
        users: lobbyUsers,
        ownerId: lobby.ownerId as number
    }
    websocket.send(JSON.stringify({ message: "lobbyData", data: lobbyData }));
}