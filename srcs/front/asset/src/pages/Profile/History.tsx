import { useEffect, useState } from "react";
import MatchHistory from "../../components/MatchHistory";
import { gpt } from "../../translations/pages_reponses";

interface GetPlayerHistoryReturnPlayer
{
    id: number;
    userId: number;
    score: number;
}

interface GetPlayerHistoryReturn
{
    score: number;
    opponents: Array<GetPlayerHistoryReturnPlayer>;
    you: GetPlayerHistoryReturnPlayer;
    playTime: number;
    gameId: number;
    tournamentId: number;
    gameDate: Date;
    isWinner: number
}

export default function History({ playerId }: { playerId: number }) {
  const [matches, setMatches] = useState<GetPlayerHistoryReturn[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(false);

      try {
        const res = await fetch(`/api/game/history/${playerId}`);

        if (!res.ok) throw new Error("ERROR");
        const data = await res.json();
  
        const parsedGames = data.games.map((match: any) => ({
          ...match,
          gameDate: new Date(match.gameDate)
        }));
        setMatches(parsedGames);
      } catch (err) {
        console.error("Erreur fetch:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory().catch((error) => {
      console.error("Error fetching match history:", error);
    });
  }, [playerId]); 

  if (loading) return <p className="text-yellow">Loading...</p>;
  if (!matches || matches.length === 0) return <p className="text-yellow my-5">{gpt("no_match")}</p>;
  return (
    <div className="flex flex-col gap-4 h-[500px] p-4 border-yellow border-1 rounded-2xl">
      <h2 className="text-yellow text-2xl">{gpt("match_history")}</h2>
      <span className="flex flex-col gap-4 h-[500px] overflow-scroll">
      {matches.map((match, idx) => (
        <MatchHistory
        key={match.gameId}
        match={match}
      />))}
      </span>
    </div>
  );
}