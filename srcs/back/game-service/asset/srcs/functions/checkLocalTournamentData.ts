import { PostLocalTournamentBody, PostLocalTournamentGamesBody } from "../routes/localTournament";

export function checkLocalTournamentData(data: PostLocalTournamentBody)
{
    if (data.players.size < 2 || data.players.size > 64)
        return (false);
    return (true);
}

export function checkLocalTournamentGamesData(data: PostLocalTournamentGamesBody)
{
    const games = data.games;
    console.log('games', games, 'size', games.size);
    if (games.size < 1 || games.size % 2 != 0)
        return (false);
    return (true);
}