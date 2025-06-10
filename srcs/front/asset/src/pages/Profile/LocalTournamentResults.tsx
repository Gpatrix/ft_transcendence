import { use, useEffect, useState } from "react";
import { gpt } from "../../translations/pages_reponses";
import { ethers } from "ethers";

function parseGamesJson(gamesJson: string | object): Map<number, Array<number>> {
    try {
        console.log('Parsing games JSON:', gamesJson);
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
            // console.log(`Parsing game with key: ${key}, value: ${value}`);
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

function stringifiyGamesJson(games: Map<number, Array<number>>): string {
    const gamesObject: { [key: number]: Array<number> } = {};
    games.forEach((value, key) => {
        gamesObject[key] = value;
    });
    return JSON.stringify(gamesObject);
}

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
  playerId = 1; // <= you will have to delete this when you will fix the player login in frontend
  const [tournamentsInfos, setTournamentsInfos] = useState<TournamentInfos[] | null>(null);
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
                    tournament.players = JSON.parse(tournament.players as string);
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
                        console.log(`Fetching scores for tournament ${tournament.id}, game ${j}`);
                        const match: number[] | undefined = localTournamentGames.get(j);
                        let maxScore: number = 0;
                        if (!match)
                            continue ;
                        let matchScore: TournamentScoreGame = {
                            isLastGame: j === localTournamentGames.size - 1,
                            players: []
                        };
                        for (let k = 0; k < match.length; k++) {
                            console.log(`Fetching score for player ${k} in game ${j} from tournament ${tournament.id}`);
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
                                console.log(`Score of player ${player} (${tournament.players[player]}) in game ${j} from tournament ${tournament.id}: ${matchPlayer.score}`);
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
            console.log(resJson)
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
            console.log('array', array);
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
      console.log("Blockchain infos fetched:", data);
    }

    useEffect(() => {
        console.log(tournamentScores)
        if (!tournamentScores || tournamentScores.length === 0)
            return ; // console.log('Waiting for tournamentScores to be set')
        console.log("Tournament scores fetched:", tournamentScores);
    }, [tournamentScores]);

    useEffect(() => {
        if (!tournamentsInfos || !blockchainInfos || !blockchainInfos.factoryAddress || !blockchainInfos.tournamentABI || !blockchainInfos.factoryABI)
            return ; // console.log("Waiting for tournamentsInfos or blockchainInfos to be set")
        fetchScores();
    }, [tournamentsInfos, blockchainInfos]);

    useEffect(() => {
        getBlockchainInfos().catch((error) => {
        console.error("Cannot get blockchain infos:", error);
        return ;
        }).then(() => {
            console.log("then")
            getLocalHistory().catch((error) => {
                console.error("Cannot get local history:", error);
                return ;
            }).then(() => {
                // console.log("then2")
                fetchScores().catch(error => {
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