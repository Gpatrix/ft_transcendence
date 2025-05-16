export function isPlayerWinnerInGame(game: any, userId: number): number
{
    let playerScore = 0;
    let maxScore = 0; 
    game.players.forEach((player: any) => {
        if (player.userId == userId)
        {
            playerScore = player.score;
        }
        else if (player.score > maxScore)
            maxScore = player.score;
    });
    if (playerScore > maxScore)
        return (1);
    else if (playerScore == maxScore)
        return (0)
    else
        return (-1);
}