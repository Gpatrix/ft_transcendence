interface pos {
    x: number,
    y: number
}

class PongGame {
    constructor (playerIds: Array<number>) {
        this.ballPos = { x: 0, y: 0};
        this.playersPos = new Map<number, pos>()
        if (playerIds.length == 2)
        {
            this.playersPos.set(playerIds[0], { x: (this.width / 2 ) * -1, y: 0})
            this.playersPos.set(playerIds[1], { x: this.width / 2 , y: 0})
        }
    }
    playerMove(playerId: number, move: number)
    {
        const playerPos = this.playersPos.get(playerId)
        const playerPosY = playerPos?.y;
        if (!playerPosY)
            throw new Error('not_existing_player_pos');
        if (playerPosY + this.playerHeight / 2 >= this.height / 2)
            return ;
        else
            this.playersPos.set(playerId, {x: playerPos.x, y: playerPosY});
    }
    width: number = 200
    height: number = 200
    playerHeight: number = 50
    playerWidth: number = 20
    ballPos: pos
    playersPos: Map<number, pos>
}

module.exports = PongGame;
