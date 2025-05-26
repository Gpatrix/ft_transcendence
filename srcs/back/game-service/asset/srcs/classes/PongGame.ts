import { prisma } from '../config/prisma';
import WebSocket from 'ws';
import { Ball } from './Ball';

export interface pos {
    x: number,
    y: number
}

export type velocity = pos;
export type dimension = pos



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
            if (i % 0)
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
    constructor (playerIds: Array<number>, id: number) {
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
            racketHeight : 60,
            nbPlayers : 2
        }
        this.ball = new Ball(this.properties)
    }

    initPlayers() {
        const padding = this.properties.racketPadding 
        this.players.map((player, i)=>{
            player.position = {
                x: (i % 2 == 0) ? padding // left
                                : this.properties.size.width - padding - this.properties.racketWidth,

                y: (i < 3)      ? 2
                                : this.properties.size.height - this.properties.racketHeight - this.properties.racketPadding - 2
            }
        })
    }

    initGame() {
        this.sendBall()
        this.startedAt = Date.now() 
        this.initPlayers()
        this.sendPlayers("start")
        this.ball.resetPos()
        setTimeout(()=>{
            this.ball.unFreeze()
            this.sendBall()
        }, 3000)
    }



    start() {
        this.initGame()
    
        this.interval = setInterval(() => {
            this.sendPlayers("update")
            if (!this.ball.isFreezed) {
                this.ball.checkRacketCollision(this.players)
                this.ball.nextPos();

                const looserPlayerId = this.ball.checkVerticalCollision() 
                if (looserPlayerId != -1)
                {
                    this.ball.resetPos()
                    this.sendBall()
                    this.teams.newScore(looserPlayerId)
                    this.sendResults()
                    setTimeout(()=>{
                        this.sendBall()
                        this.ball.unFreeze()
                    }, 1000)
                }
            }
        }, 1000 / 60);

        this.timeout = setTimeout(() => {
            this.onEnd();
        }, 15 * 60 * 1000);
    }

    onEnd() {
        prisma.game.update({
            where: {
                id: this.id
            },
            data: {
                playTime: this.getDuration() / 1000,
                closedAt: new Date()
            }
        })
        this.players.forEach(player => {
            if (player.ws) {
                player.ws.send(JSON.stringify({ message: `gameEnded`, gameId: this.id }));
                player.ws.close();
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
        const player = this.players.find(player => player.id == id) as Player;
        const newY = player.position.y + move

        if (newY >= 0 && (newY + this.properties.racketHeight) < this.properties.size.height)
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

    onPlayerJoin(id: number, ws: WebSocket) { // send user update to everyone, start if everyone is here
        console.log(`Player ${id} joined`);
        const index = this.players.findIndex(player => player.id == id);
        if (index !== -1) {
            this.players[index].ws = ws;
        }
        this.sendPlayers(`playerJoined`)
        if (this.players.length == this.properties.nbPlayers) {
            if (this.startedAt) {// on unfreeze, after a disconnect
                this.players.forEach(player => {
                    if (player.ws)
                        player.ws.send(JSON.stringify({
                            message: "unfreeze",
                    }));
                });
                this.ball.unFreeze()
            }
            else
                this.start()
        }
    }

    onPlayerLeave(id: number) {
        console.log("PLAYER LEAVED")
        this.ball.freeze()

        this.players.forEach(player => {
            if (player.ws)
                player.ws.send(JSON.stringify({
                    message: "freeze",
            }));
        });
    }


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
}

// module.exports = PongGame;
