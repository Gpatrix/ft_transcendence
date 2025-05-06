import prisma from '../config/prisma';
import { GamesManager } from '../classes/GamesManager';

interface pos {
    x: number,
    y: number
}

type velocity = pos;

class Ball {
    constructor (position: pos, velocity: velocity, radius: number = 5) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }
    position: pos;
    velocity: velocity;
    radius: number;
    isFreezed: boolean = true;
    lastToucher: number = -1;

    set setVelocity(newVelocity: velocity) {
        if (newVelocity.x < 10)
            this.velocity.x = newVelocity.x;
        if (newVelocity.y < 10)
            this.velocity.y = newVelocity.y;      
    }

    set setPosition(newPosition: pos) {
        this.position = newPosition;
    }

    nextPos() {
        if (!this.isFreezed)
        {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    resetPos() {
        this.position.x += 0;
        this.position.y += 0;
    }
}

class Player {
    constructor(id: number, position: pos) {
        this.id = id;
        this.position = position;
    }
    id: number;
    position: pos;
    ws?: WebSocket;
    score: number = 0;
    
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

class PongGame {
    constructor (playerIds: Array<number>, id: number) {
        this.ball = this.initBall(playerIds);
        this.players = [
            new Player(playerIds[0], { x: (this.width / 2 ) * -1, y: 0}),
            new Player(playerIds[1], { x: this.width / 2 , y: 0})
        ];
        this.id = id;
    }

    start() {
        // tick every fps

        this.interval = setInterval(() => {
            this.managePlayerColision();
            this.manageRoofAndFloorColision();
            this.ball.nextPos();
            const looserPlayerId = this.isBallColidingWall();
            if (looserPlayerId != -1) {
                this.ball.resetPos();
                console.log(`Ball colided with wall`);
                if (this.ball.lastToucher == -1)    // In case ball collide player's wall before being hit
                    this.scoreEveryone(looserPlayerId)
                else
                {
                    const winner = this.players.find(player => player.id == this.ball.lastToucher);
                    winner?.scoreGoal();
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

    private initBall(playerIds: Array<number>): Ball
    {
        const n = playerIds.length;
        let ball: Ball;
        if (n == 2)
        {
            const a = Math.floor(Math.random() * n);
            if (a == 1)
                ball = new Ball({ x: this.width / 2, y: 0 }, { x: -1, y: 0 });
            else
                ball = new Ball({ x: (this.width / 2) * -1, y: 0 }, { x: 1, y: 0 });
        }
        else if (n == 3)
        {
            const a = Math.floor(Math.random() * n);
            if (a == 1)
                ball = new Ball({ x: this.width / 2, y: 0 }, { x: -1, y: 0 });
            else if (a == 2)
                ball = new Ball({ x: (this.width / 2) * -1, y: 0 }, { x: 1, y: 0 });
            else
                ball = new Ball({ x: this.width / 2, y: 0 }, { x: -1, y: 0 });
        }
        else if (n == 4)
        {
            const a = Math.floor(Math.random() * n);
            if (a == 1)
                ball = new Ball({ x: this.width / 2, y: 0 }, { x: -1, y: 0 });
            else if (a == 2)
                ball = new Ball({ x: (this.width / 2) * -1, y: 0 }, { x: 1, y: 0 });
            else if (a == 3)
                ball = new Ball({ x: this.width / 2, y: 0 }, { x: -1, y: 0 });
            else
                ball = new Ball({ x: (this.width / 2) * -1, y: 0 }, { x: 1, y: 0 });
        }
        else
            ball = new Ball({ x: this.width / 2, y: 0 }, { x: -1, y: 0 });
        return (ball);
    }


    private scoreEveryone(idToNotScore: number) {
        this.players.forEach(player => {
            if (player.id == idToNotScore)
                return ;
            player.scoreGoal();
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
        const playerPos = player.position;
        if (move + this.playerHeight / 2 >= this.height / 2)
            return ;
        else
            player.position = { x: playerPos.x, y: playerPos.y };
    }

    onPlayerJoin(id: number, ws: WebSocket) {
        // console.log(`Player ${id} joined`);
        const index = this.players.findIndex(player => player.id == id);
        if (index !== -1) {
            this.players[index].ws = ws;
        }
        this.players.forEach(player => {
            if (player.ws)
                player.ws.send(JSON.stringify({ message: `playerJoined`, playerId: id }));
        })
    }

    onPlayerLeave(id: number) {
        // console.log(`Player ${id} leaved`);
        const index = this.players.findIndex(player => player.id == id);
        if (index === -1)
            return ;
        this.players[index].ws = undefined;
        this.players.forEach(player => {
            if (player.ws)
                player.ws.send(JSON.stringify({ message: `playerLeft`, playerId: id }));
        })
    }

    private isBallColidingPlayer(playerPos: pos): boolean {
        let isInX = false;
        let isInY = false;
        const ballPos = this.ball.position;
        if ((ballPos.x >= playerPos.x - this.playerWidth / 2) && (ballPos.x <= playerPos.x + this.playerWidth / 2))
            isInX = true;
        if ((ballPos.y >= playerPos.y - this.playerHeight / 2) && (ballPos.y <= playerPos.y + this.playerHeight / 2))
            isInY = true;
        return (isInX && isInY);
    }

    managePlayerColision(): void {
        this.players.forEach(player => {
            if (this.isBallColidingPlayer(player.position))
            {
                this.ball.lastToucher = player.id;
                this.ball.velocity.x *= -1;
            }
        })
    }

    manageRoofAndFloorColision(): void {
        const ballPos = this.ball.position;
        if ((ballPos.y <= this.height * -1) || (ballPos.y >= this.height))
            this.ball.velocity.y *= -1;
    }

    private isBallColidingWall(): number {
        const ballPos: pos = this.ball.position;
        const playerCount: number = this.players.length;
        if (playerCount == 2)
        {
            if (ballPos.x <= this.width / 2 * -1)
                return (this.players[0].id);
            else if (ballPos.x >= this.width / 2)
                return (this.players[1].id);
        }
        else
        {
            if (ballPos.x <= this.width / 2 * -1)
                return (this.players[0].id);
            else if (ballPos.x >= this.width / 2)
                return (this.players[1].id);
        }
        return (-1);
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

module.exports = PongGame;
