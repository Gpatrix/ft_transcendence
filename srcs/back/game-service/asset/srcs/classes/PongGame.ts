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

    nextPos() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    previousPos() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Player {
    constructor(id: number, position: pos) {
        this.id = id;
        this.position = position;
    } 
    id: number;
    position: pos;
}

class PongGame {
    constructor (playerIds: Array<number>) {
        this.ball = new Ball({ x: 0, y: 0 }, { x: 1, y: 0 });
        this.players = [
            new Player(playerIds[0], { x: (this.width / 2 ) * -1, y: 0}),
            new Player(playerIds[1], { x: this.width / 2 , y: 0})
        ];
    }

    start() {
        this.interval = setInterval(() => {
            this.ball.nextPos();
        }, 1000 / 60);
        this.timeout = setTimeout(() => {
            this.end();
        }, )
    }

    end() {
        console.log('end of the game')
    }

    onPlayerLeave(id: number) {
        console.log(`Player ${id} leaved`);
        const index = this.players.findIndex(player => player.id == id);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    } 

    isBallColidingPlayer(playerPos: pos): boolean {
        let isInX = false;
        let isInY = false;
        const ballPos = this.ball.position;
        if ((ballPos.x >= playerPos.x - this.playerWidth / 2) && (ballPos.x <= playerPos.x + this.playerWidth / 2))
            isInX = true;
        if ((ballPos.y >= playerPos.y - this.playerHeight / 2) && (ballPos.y <= playerPos.y + this.playerHeight / 2))
            isInY = true;
        return (isInX && isInY);
    }

    manageRoofAndFloorColision(): void {
        const ballPos = this.ball.position;
        if ((ballPos.y <= this.height * -1) || (ballPos.y >= this.height))
            this.ball.velocity.y *= -1;
    }

    playerMove(playerId: number, move: number)
    {
        const player = this.players.find(player => player.id == playerId) as Player;
        const playerPos = player.position;
        if (move + this.playerHeight / 2 >= this.height / 2)
            return ;
        else
            player.position = { x: playerPos.x, y: playerPos.y };
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
}

module.exports = PongGame;
