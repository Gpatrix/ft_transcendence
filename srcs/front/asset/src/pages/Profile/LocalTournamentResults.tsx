import { useEffect, useState } from "react";
import { gpt } from "../../translations/pages_reponses";
import { ethers } from "ethers";

function parseGamesJson(gamesJson: string | object): Map<number, Array<number>> {
    try {
        
        let games: object | undefined = undefined;

        if (typeof gamesJson === 'string')
            games = JSON.parse(gamesJson);
        else if (typeof gamesJson === 'object')
            games = gamesJson as object;
        else
            throw new Error('Invalid JSON format (games not of type string or object)');
        if (games === undefined) {
            throw new Error('Invalid JSON format (games == undefined)');
        }

        const gamesMap = new Map<number, Array<number>>();

        Object.entries(games).forEach(([key, value]) => {
            // 
            const objectValues = Object.values(value).map(stringValue => Number(stringValue));
            const values: Array<number> = Array<number>(...objectValues);
            if (values.some((number: number) => typeof number != 'number'))
                throw new Error('Invalid JSON format (values is not a number)' + values);
            gamesMap.set(Number(key), values)
        });
        return (gamesMap);
    } catch (error) {
        // console.error('Error parsing games JSON:', error);
        throw new Error('Error parsing games JSON:' + error);
    }
}

// function stringifiyGamesJson(games: Map<number, Array<number>>): string {
//     const gamesObject: { [key: number]: Array<number> } = {};
//     games.forEach((value, key) => {
//         gamesObject[key] = value;
//     });
//     return JSON.stringify(gamesObject);
// }

interface TournamentInfos
{
    id: number;
    players: Array<string>;
    games: Map<number, Array<number>>;
}

interface TournamentScoreGamePlayer {
    id: number,
    score: number | null,
    name: string,
    isWinner: boolean
}

interface TournamentScoreGame {
    players: TournamentScoreGamePlayer[],
    isLastGame: boolean
}

interface TournamentScore
{
    id: number,
    smartContractAddress: string,
    games: Array<TournamentScoreGame>
}

export default function LocalTournamentHistory({ playerId }: { playerId: number }) {
  void playerId
  const [tournamentsInfos, setTournamentsInfos] = useState<TournamentInfos[] | null>(null);
  const [loading] = useState(true);
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
  });
  const [tournamentScores, setTournamentScores] = useState<TournamentScore[] | null>(null);

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

    async function fetchScores() {
        if (!blockchainInfos.factoryAddress || !blockchainInfos.tournamentABI || !blockchainInfos.factoryABI)
            return ;
        try {
            const factory = getFactory();
            const provider = getProvider();
            const tournamentScores: TournamentScore[] = [];
            if (tournamentsInfos)
            {
                for (let i = 0; i < tournamentsInfos.length; i++) {
                    const tournament = tournamentsInfos[i];
                    tournament.players = JSON.parse(tournament.players as unknown as string);
                    const smartContractAddress = await factory.getTournament(tournament.id);
                    if (!smartContractAddress || smartContractAddress == ethers.ZeroAddress)
                    throw new Error("Tournament not found in blockchain");
                    const tournamentContract = new ethers.Contract(smartContractAddress, blockchainInfos.tournamentABI as string, provider);
                    const localTournamentGames: Map<number, Array<number>> = tournament.games;
                    let tournamentScore: TournamentScore = {
                        id: tournament.id,
                        smartContractAddress,
                        games: []
                    };
                    for (let j = 0; j < localTournamentGames.size; j++) {
                        
                        const match: number[] | undefined = localTournamentGames.get(j);
                        let maxScore: number = 0;
                        if (!match)
                            continue ;
                        let matchScore: TournamentScoreGame = {
                            isLastGame: j === localTournamentGames.size - 1,
                            players: []
                        };
                        for (let k = 0; k < match.length; k++) {
                            
                            const player = match[k];
                            let matchPlayer: TournamentScoreGamePlayer = {
                                id: player,
                                name: tournament.players[player],
                                score: null,
                                isWinner: false
                            }; 
                            try {
                                matchPlayer.score = Number(await tournamentContract.getPlayerScore(j, player));
                                if (matchPlayer.score > maxScore) {
                                    maxScore = matchPlayer.score;
                                    matchPlayer.isWinner = true;
                                    matchScore.players.forEach((p) => {
                                        if (p.id === player)
                                            return ;
                                        p.isWinner = false;
                                    });
                                }
                                
                            } catch (error) {
                                console.error(`Cannot fetch player ${player} (${tournament.players[player]}) in game ${j} from tournament ${tournament.id}: `, error);
                            }
                            matchScore.players.push(matchPlayer);
                        }
                        tournamentScore.games.push(matchScore);
                    }
                    tournamentScores.push(tournamentScore);
                }
                setTournamentScores(tournamentScores);
            }
        } catch (error) {
            // console.error(error);
        }
    }

    async function getLocalHistory()
    {
        try {
            const res = await fetch(`/api/game/local/history`);
            if (!res.ok)
              throw new Error("Cannot fetch local history");
            const resJson = await res.json();
            if (!resJson)
                throw new Error("Cannot fetch local history");
            const array: TournamentInfos[] = [];
            
            for (let i = 0; i < resJson.length; i++) {
                const element = resJson[i]
                const games = parseGamesJson(resJson[i].games);
                if (!(element.id) || !(element.players) || !games)
                    throw new Error("Missins elements in local history");
                const tournamentInfos: TournamentInfos = {
                    id: element.id,
                    games: games,
                    players: element.players
                }
                array.push(tournamentInfos);
            }
            
            setTournamentsInfos(array);
        } catch (error) {
            // console.error('Cannot get user local tournaments history');
        }

    }
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
      
    }

    useEffect(() => {
        
        if (!tournamentScores || tournamentScores.length === 0)
            return ; // 
        
    }, [tournamentScores]);

    useEffect(() => {
        if (!tournamentsInfos || !blockchainInfos || !blockchainInfos.factoryAddress || !blockchainInfos.tournamentABI || !blockchainInfos.factoryABI)
            return ; // 
        fetchScores();
    }, [tournamentsInfos, blockchainInfos]);

    useEffect(() => {
        getBlockchainInfos().catch((error) => {
        console.error("Cannot get blockchain infos:", error);
        return ;
        }).then(() => {
            
            getLocalHistory().catch((error) => {
                console.error("Cannot get local history:", error);
                return ;
            }).then(() => {
                // 
                fetchScores().catch(() => {
                    return ;
                });
            });
        });
    }, []);

  if (loading) return <p className="text-yellow">Loading...</p>;
  if (!tournamentScores || tournamentScores.length === 0) return <p className="text-yellow my-5">{gpt("no_match")}</p>;
  return (
    <div className="flex flex-col gap-4 h-[500px] p-4 border-yellow border-1 rounded-2xl">
      <h2 className="text-yellow text-2xl">{gpt("match_history")}</h2>
      <span className="flex flex-col gap-4 h-[500px] overflow-scroll">
        {
        }
      </span>
    </div>
  );
}