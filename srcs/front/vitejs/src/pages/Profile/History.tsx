import { useEffect, useState } from "react";
import MatchHistory from "../../components/MatchHistory";

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
    gameDate: Date;
    isWinner: number
}

export default function History({ playerId }: { playerId: number }) {
  const [matches, setMatches] = useState<GetPlayerHistoryReturn[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/game/history/${playerId}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des données");
        const data = await res.json();
        setMatches(data.games);
      } catch (err) {
        console.error("Erreur fetch:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [playerId]);

  if (loading) return <p className="text-yellow">Loading...</p>;
  if (!matches || matches.length === 0) return <p className="text-yellow">No match found.</p>;

  return (
    <div className="flex flex-col gap-4 h-[500px] overflow-scroll">
      {matches.map((match, idx) => (
        <MatchHistory
        key={match.gameId}
        match={match}
      />))}
    </div>
  );
}