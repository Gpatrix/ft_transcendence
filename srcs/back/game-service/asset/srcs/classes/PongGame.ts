import { prisma } from '../config/prisma';
import WebSocket from 'ws';
import { Ball } from './Ball';
import { activeGameConn, users1v1, users2v2, usersFriends1v1, usersFriends2v2 } from '../routes/game';

export interface pos {
    x: number,
    y: number
}

export type velocity = pos;
export type dimension = pos

export class PauseManager {
    isPausing:boolean = false;
    currentPlayerId?: number;
    knownPlayerIds: Set<number>;
    constructor () {
        this.knownPlayerIds = new Set()
    }

    public askForPause(playerId: number): boolean {
        if (this.isPausing) {
            return (false);
            // throw (new Error('Game is already in pause'));
        }

        if (this.knownPlayerIds.has(playerId)) {
            return (false);
            // throw (new Error('This player cannot ask for a pause'));
        }
        this.knownPlayerIds.add(playerId);
        this.currentPlayerId = playerId;
        this.isPausing = true;
        return (true);
    }

    public endPause(playerId?: number) {
        if (!this.isPausing)
            return (false);
        if (playerId && playerId != this.currentPlayerId)
            return (false);
        this.isPausing = false;
        this.currentPlayerId = undefined;
        return (true)
    }
}


export class Player {
    constructor(id: number, position: pos) {
        this.id = id;
        this.position = position;
        this.properties = {
            height:70,
            width:10
        }
    }
    id: number;
    position: pos;
    ws?: WebSocket;
    score: number = 0;
    properties: {
        width: number
        height: number
    }
    
    async scoreGoal() {
        const existingPlayer = await prisma.player.findUnique({
            where: {
                id: this.id
            }
        })
        if (!existingPlayer)
            return ;
        prisma.player.update({
            where: {
                id: this.id
            },
            data: {
                score: existingPlayer.score + 1
            }
        })
        this.score++;
    }
}

export type properties = {
    size : {
        width  : number
        height : number
    }
    racketPadding: number
    racketWidth: number
    racketHeight: number
    nbPlayers : number
}


export type team = {
    score : number
    playersIDs : Array<number>
}

class Teams {
    teams : Array<team>

    constructor (players : Array<number>) {
        this.teams = [
            { score: 0, playersIDs: [] },
            { score: 0, playersIDs: [] }
        ];

        players.map((id, i )=> {
            if (i % 2)
                this.teams[1].playersIDs.push(id)
            else
                this.teams[0].playersIDs.push(id)
        })
    }

    getResult() {
        return ([
            this.teams[0].score, 
            this.teams[1].score
        ])
    }

    newScore(looserId : number) {
        this.teams[looserId].score ++
    }
}

export class PongGame {
    properties : properties
    teams : Teams
    constructor (playerIds: Array<number>, id: number, nbPlayers: number) {
        this.teams = new Teams(playerIds)
        this.players = []
        playerIds.map((playerId, i)=>{
            this.players.push(new Player(
                playerId, 
                { x: 0 , y: 0}
            ))
        })
        this.id = id;
        this.properties = {
            size : {
                width : 700,    
                height : 500
            },
            racketPadding : 20,
            racketWidth : 10,
            racketHeight : 70,
            nbPlayers : nbPlayers
        }
        this.ball = new Ball(this.properties);
        this.pauseManager = new PauseManager();
    }

    initPlayers() {
        this.players.map((player, i) => {
            player.position = {
                x: (i % 2 === 0) 
                    ? this.properties.racketPadding
                    : this.properties.size.width - this.properties.racketPadding - this.properties.racketWidth,
        
                y: (i < 2)
                    ? 2
                    : this.properties.size.height - this.properties.racketHeight - this.properties.racketPadding - 2
            }
        });
    }

    initGame() {
        this.sendResults();
        this.sendBall()
        this.startedAt = Date.now() 
        this.initPlayers()

        setTimeout(()=> {
            this.sendPlayers("start")
        }, 1000)

        
        setTimeout(()=>{
            this.ball.resetPos()
            this.ball.unFreeze()
            this.sendBall()
        }, 4100)
    }

    public pause(playerId: number) {
        if (this.ball.isFreezed)
            return ;
        if (!(this.pauseManager.askForPause(playerId))) {
            const player = this.players.find((player) => player.id === playerId);
            return player?.ws.send(JSON.stringify('pauseContested'));
        }
        this.ball.freeze();
        this.players.forEach(player => {
            if (player.ws) {
                player.ws.send(JSON.stringify({ message: `gamePaused`, gameId: this.id }));
            }
        });
        setTimeout(() => {
            this.unPause();
        }, 10 * 1000);
    }

    public unPause(playerId?: number) {
        if (!this.pauseManager.endPause(playerId))
            return ;
        this.players.forEach(player => {
            if (player.ws) {
                player.ws.send(JSON.stringify({ message: `gameUnpaused`, gameId: this.id }));
            }
        });
        setTimeout(() => {
            this.ball.unFreeze();
        }, 1000);
    }

    start() {
        this.initGame()
        let lastTime = performance.now();
    
        this.interval = setInterval(() => {
            const now = performance.now();
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;
    
            this.sendBall();
    
            this.sendPlayers("update");
            this.ball.checkRacketCollision(this.players);
            if (!this.ball.isFreezed) {

                this.ball.nextPos(deltaTime);
    
                const looserPlayerId = this.ball.checkVerticalCollision();
                if (looserPlayerId != -1) {
                    this.ball.resetPos();
                    this.sendBall();
                    this.teams.newScore(looserPlayerId);
                    this.sendResults();
                    if (this.teams.getResult().find((e)=> e >= 10)) {
                        this.endGame()
                    }

                    setTimeout(() => {
                        this.sendBall();
                        this.ball.unFreeze();
                    }, 1000);
                }
            }
        }, 1000 / 60);
    
        this.timeout = setTimeout(() => {
            this.onEnd();
        }, 15 * 60 * 1000);
    }
    

    async onEnd() {
        await prisma.game.update({
            where: {
                id: this.id,
            },
            data: {
                closedAt: new Date(),
            }
        })

        const game =  await prisma.game.findFirst({
            where: {
                id: this.id,
            },
        })

        await Promise.all(this.players.map(async player => {
            const teamIndex = this.teams.teams.findIndex(t => t.playersIDs.includes(player.id));
            const score = this.teams.teams[teamIndex ^ 1].score;

            const playerEntry = await prisma.player.findFirst({
              where: {
                userId: player.id,
                gameId: this.id
              }
            });
    
            if (playerEntry) {
              await prisma.player.update({
                where: { id: playerEntry.id },
                data: { score: score }
              });
            }
          }));

        this.players.forEach(player => {
            if (player.ws) {
                player.ws.send(JSON.stringify({ message: `gameEnded`, gameId: this.id }));
                player.ws.close();
                activeGameConn.delete(player.id)
                users1v1.handleUserDisconnection(player.id)
                users2v2.handleUserDisconnection(player.id)
                usersFriends1v1.handleUserDisconnection(player.id)
                usersFriends2v2.handleUserDisconnection(player.id)
            }
        })
    }

    endGame() {
        this.timeout?.close();
        this.interval?.close();
        this.onEnd();
    }

    getDuration(): number {
        if (!this.startedAt)
            return (0);
        return (Date.now() - this.startedAt);
    }

    onPlayerMove(id: number, move: number)
    {
        if (this.isPaused == true)
            return ;
        const player = this.players.find(player => player.id == id) as Player;
        let newY : number = player.position.y + move


        if (move < 0) {  // up
            if (newY <= 0) {
                newY = 0
            }
        }
        else { // down
            if (newY + this.properties.racketHeight > this.properties.size.height) {
                newY = this.properties.size.height - this.properties.racketHeight - 3
            }
        }
        player.position.y = newY
    }

    sendPlayers(message: string) {
        this.players.forEach(player => {
            if (player.ws)
                player.ws.send(JSON.stringify({
                    message: message,
                    players: this.players.map(p => ({
                        id: p.id,
                        score: p.score,
                        position: p.position,
                        isYours: p.id === player.id
                    }))
            }));
        });
    }

    sendBall() {
        this.players.forEach(player => {
            if (player.ws)
                player.ws.send(JSON.stringify({
                    message: "ball",
                    ball: {
                        velocity: this.ball.velocity,
                        position: this.ball.position
                    }
            }));
        });        
    }

    sendResults() {
        this.players.forEach(player => {
            if (player.ws)
                player.ws.send(JSON.stringify({
                    message: "result",
                    result: [this.teams.getResult()]
            }));
        });
    }

    onPlayerJoin(id: number, ws: WebSocket) {
        this.markPlayerConnected(id);
        console.log(`Player ${id} joined`);
    
        const index = this.players.findIndex(player => player.id == id);
        if (index !== -1) {
            this.players[index].ws = ws;
        }
    
        this.sendPlayers(`playerJoined`);
    
        // verifier si tous les joueurs sont connectes et lance le jeu si oui
        if (this.isReady()) {
            if (this.startedAt) { // Si le jeu a deja demarre, on "unfreeze"
                this.players.forEach(player => {
                    if (player.ws) player.ws.send(JSON.stringify({ message: "unfreeze" }));
                });
                this.sendResults();
                this.ball.unFreeze();
            } else {
                this.start();
            }
        }
    }
    

    onPlayerLeave(id: number) {
        this.markPlayerDisconnected(id)
        this.ball.freeze()


        this.players.forEach(player => {
            if (player.ws) {
                player.ws.send(JSON.stringify({message: "freeze",}));
            }
        });
        if (this.areAllPlayersDisconnected()) {
            this.onEnd()
        }
    }

    hasPlayer(userId: number): boolean {
        return this.players.some(player => player.id === userId);
    }
    
    // isReady(): boolean {
    //     return this.players.every(player => player.ws);
    // }

    isReady(): boolean {
        return this.players.every(player => player.ws !== undefined);
    }

    addSocket(userId: number, ws: WebSocket): boolean {
        const player = this.players.find(p => p.id === userId);
        if (!player) {
            console.warn(`addSocket: No player found with ID ${userId}`);
            return false;
        }
    
        player.ws = ws;
        this.onPlayerJoin(userId, ws);
        return true;
    }

    removePlayer(userId: number): void {
        const player = this.players.find(p => p.id === userId);
        if (!player) {
            console.warn(`removePlayer: No player found with ID ${userId}`);
            return;
        }
    
        player.ws = undefined;
        this.onPlayerLeave(userId);
    }

    markPlayerConnected(userId: number) {
        this.connectedPlayers.add(userId);
        this.disconnectedPlayers.delete(userId);
    }

    markPlayerDisconnected(userId: number) {
        this.connectedPlayers.delete(userId);
        this.disconnectedPlayers.add(userId);
    }

    areAllPlayersDisconnected(): boolean {
        return this.connectedPlayers.size === 0;
    }

    allConnected(expectedPlayerCount : number): boolean {
        return (this.connectedPlayers.size === expectedPlayerCount)
    }

    private connectedPlayers: Set<number> = new Set();
    private disconnectedPlayers: Set<number> = new Set();
    ball: Ball
    width: number = 200
    height: number = 200
    playerHeight: number = 50
    playerWidth: number = 20
    players: Array<Player>;
    duration: number = 5 * 60 * 1000
    interval?: NodeJS.Timeout
    timeout?: NodeJS.Timeout
    startedAt?: number 
    id: number;
    pauseManager: PauseManager;
}

// module.exports = PongGame;
