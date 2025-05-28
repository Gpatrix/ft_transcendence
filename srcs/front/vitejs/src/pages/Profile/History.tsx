import { use, useEffect, useState } from "react";
import MatchHistory from "../../components/MatchHistory";
import { gpt } from "../../translations/pages_reponses";
import { ethers } from "ethers";

interface GetPlayerHistoryReturnPlayer
{
    id: number;
    userId: number;
    score: number;
    scoreFromBlockchain: number | undefined;
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
  playerId = 1; // <= you will have to delete this when you will fix the player login in frontend
  const [matches, setMatches] = useState<GetPlayerHistoryReturn[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockchainInfos, setBlockchainInfos] = useState<{
    rpcURL: string | undefined,
    factoryAddress: string | undefined,
    tournamentABI: string | undefined,
    factoryABI: string | undefined
  }>({
    rpcURL: undefined,
    factoryAddress: undefined,
    tournamentABI: undefined,
    factoryABI: undefined
  })

  useEffect(() => {
    async function getBlockchainInfos()
    {
      const res = await fetch(`/api/blockchain/infos`);
      if (!res.ok)
        throw new Error("Cannot fetch blockchain infos");
      const data = await res.json();
      setBlockchainInfos({
        rpcURL: data.rpcURL,
        factoryAddress: data.factoryAddress,
        tournamentABI: data.tournamentABI,
        factoryABI: data.factoryABI
      });
      console.log("Blockchain infos fetched:", data);
    }
    getBlockchainInfos().catch((error) => {
      console.error("Cannot get blockchain infos:", error);
    });
  }, []);


  useEffect(() => {
    async function fetchHistory() {
      setMatches([
        {
          gameId: 1,
          tournamentId: 1,
          gameDate: new Date(),
          playTime: 120,
          score: 10,
          isWinner: 1,
          you: {
            id: playerId,
            userId: playerId,
            score: 10,
            scoreFromBlockchain: undefined
          },
          opponents: [
            {
              id: 2,
              userId: 2,
              score: 5,
              scoreFromBlockchain: undefined
            },
            {
              id: 3,
              userId: 3,
              score: 0,
              scoreFromBlockchain: undefined
            }
          ]
        }
      ])                                             // <= This is for testing you will have to delete this when you will implement the game saving in db and blockchain
      setLoading(false);

      // You will have to uncomment this part when you will implement game saving in db and blokchain

      // try {
      //   const res = await fetch(`/api/game/history/${playerId}`);

      //   if (!res.ok) throw new Error("ERROR");
      //   const data = await res.json();
  
      //   const parsedGames = data.games.map((match: any) => ({
      //     ...match,
      //     gameDate: new Date(match.gameDate)
      //   }));
      //   setMatches(parsedGames);
      // } catch (err) {
      //   console.error("Erreur fetch:", err);
      //   setMatches([]);
      // } finally {
      //   setLoading(false);
      // }
    }

    function getProvider(): ethers.JsonRpcProvider
    {   
      if (!blockchainInfos.rpcURL)
        throw new Error("Blochain infos are not fetched");
      const provider = new ethers.JsonRpcProvider(blockchainInfos.rpcURL);
      return (provider);
    }

    function getFactory(): ethers.Contract
    {
        const provider = getProvider();
        if (!blockchainInfos.factoryAddress || !blockchainInfos.factoryABI)
          throw new Error("Blochain infos are not fetched");
        const factory = new ethers.Contract(blockchainInfos.factoryAddress, blockchainInfos.factoryABI, provider);
        return (factory);
    }

    async function fetchAllUsersFromBlockchain() {
      if (!blockchainInfos.factoryAddress || !blockchainInfos.tournamentABI || !blockchainInfos.factoryABI)
        return ;
      try {
        const factory = getFactory();
        const provider = getProvider();
        const updatedMatches = matches;
        if (updatedMatches)
        {
          for (let i = 0; i < matches.length; i++) {
            const match = updatedMatches[i];
            const tournamentAddress = await factory.getTournament(match.tournamentId);
            if (!tournamentAddress || tournamentAddress == ethers.ZeroAddress)
              throw new Error("Tournament not found in blockchain");
            const tournament = new ethers.Contract(tournamentAddress, blockchainInfos.tournamentABI as string, provider);
            const opponents = updatedMatches[i].opponents;
            // console.log("math:", match);
            let youScoreFromBlockchain: number = 0;
            try {
              youScoreFromBlockchain = await tournament.getPlayerScore(match.gameId, match.you.userId);
              matches[i].you.scoreFromBlockchain = Number(youScoreFromBlockchain);
              console.log(`Score of player ${matches[i].you.userId} in game ${match.gameId}:`, youScoreFromBlockchain);
            } catch (error) {
              console.error(`Cannot get player ${match.you.userId} score for game ${match.gameId}:`, error);
            }
            for (let j = 0; j < opponents.length; j++) {
              const opponent = opponents[j];
              let scoreFromBlockchain: number = 0;
              try {
                scoreFromBlockchain = await tournament.getPlayerScore(match.gameId, opponent.userId);
                updatedMatches[i].opponents[j].scoreFromBlockchain = Number(scoreFromBlockchain);
                console.log(`Score of player ${opponent.id} in game ${match.gameId}:`, scoreFromBlockchain);
              } catch (error) {
                console.error(`Cannot get player ${match.you.userId} score for game ${match.gameId}:`, error);
              }
            }
          }
          setMatches(updatedMatches);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchHistory().catch((error) => {
      console.error("Error fetching match history:", error);
    });
    fetchAllUsersFromBlockchain().catch((error) => {
      console.error(error);
    });
  }, [playerId, blockchainInfos.rpcURL, blockchainInfos.factoryAddress, blockchainInfos.tournamentABI, blockchainInfos.factoryABI]); 

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