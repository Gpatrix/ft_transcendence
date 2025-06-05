import { FastifyInstance } from "fastify";
import { ethers, EthersError } from "ethers";
import addressData from "../contractData/contract-address.json";
import tournamentFactoryABIData from "../contractData/TournamentFactory.json";
import tournamentABIData from "../contractData/Tournament.json";

const HARDHAT_RPC_URL = "http://0.0.0.0:8545/";
const factoryAddress = addressData.value;
const factoryABI = tournamentFactoryABIData.abi;
const tournamentABI = tournamentABIData.abi;
let     rpcURL : string = process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
let     owner = process.env.SIGNER_PRIVATE_KEY || "0x";

if (process.env.NODE_ENV == "dev")
{
    rpcURL = HARDHAT_RPC_URL;
    owner = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // hardhat local signers[0]
}

function getProvider(): ethers.JsonRpcProvider
{    
    const provider = new ethers.JsonRpcProvider(rpcURL);
    return (provider);
}

function getDeployer(): ethers.Wallet
{
    const provider = getProvider();
    const deployer = new ethers.Wallet(owner, provider);
    return (deployer);
}

function getFactory(): ethers.Contract
{
    const wallet = getDeployer();
    const factory = new ethers.Contract(factoryAddress, factoryABI, wallet);
    return (factory);
}

async function getTournament(tournamentId: number): Promise<ethers.Contract>
{
    const factory = getFactory();
    const tournamentAddress = await factory.getTournament(tournamentId);
    if (!tournamentAddress || tournamentAddress == ethers.ZeroAddress)
        throw new Error("Tournament not found in blockchain");
    console.log('tournamentAddress', tournamentAddress);
    const deployer = getDeployer();
    const tournament = new ethers.Contract(tournamentAddress, tournamentABI, deployer);
    return (tournament);
}

async function deployTournament(tournamentId: number): Promise<ethers.ContractTransactionReceipt>
{
    const factory = getFactory();
    const tx = await factory.deployTournament(tournamentId);
    const receipt = await tx.wait();    
    return (receipt);
}

async function createGame(tournamentId: number, gameId: number): Promise<ethers.ContractTransactionReceipt>
{
    const tournament = await getTournament(tournamentId);
    const tx = await tournament.createGame(gameId);
    const receipt = await tx.wait();
    return (receipt);
}

async function addPointToPlayer(tournamentId: number, gameId: number, playerId: number): Promise<ethers.ContractTransactionReceipt>
{
    const tournament = await getTournament(tournamentId);
    const tx = await tournament.addPointToPlayer(gameId, playerId);
    const receipt = await tx.wait();
    return (receipt);
}

async function finishGame(tournamentId: number, gameId: number): Promise<ethers.ContractTransactionReceipt>
{
    const tournament = await getTournament(tournamentId);
    const tx = await tournament.finishGame(gameId);
    const receipt = await tx.wait();
    return (receipt);
}

async function finish(tournamentId: number): Promise<ethers.ContractTransactionReceipt>
{
    const tournament = await getTournament(tournamentId);
    const tx = await tournament.finish();
    const receipt = await tx.wait();
    return (receipt);
}

function saveTournamentToAvalancheRoutes (server: FastifyInstance, options: any, done: any)
{
    server.get('/api/blockchain/infos', async (req: any, res: any) => {
        try {
            res.status(200).send({
                rpcURL: rpcURL,
                factoryAddress: factoryAddress,
                tournamentABI: tournamentABI,
                factoryABI: factoryABI,
            });
        } catch (error) {
            res.status(500).send({ error: "0500" });
        }
    });

    interface deployTournamentParams {
        tournamentId: number;
    }

    interface deployTournamentBody {
        credential: string;
    }

    server.post<{ Params: deployTournamentParams, Body: deployTournamentBody }>('/api/blockchain/deploy/:tournamentId', async (req: any, res: any) => {
        const credential = req.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            res.status(401).send({ error: "private_route" });
        try {
            const deployTransactionReceipt = await deployTournament(req.params.tournamentId);
            res.send({ status: "ok", transactionHash: deployTransactionReceipt.hash, contractAddress: deployTransactionReceipt.to });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
            res.status(500).send({ error: "0500" });
        }
    });

    interface createGameParams {
        tournamentId: number;
        gameId: number;
    }

    interface createGameBody {
        credential: string;
    }

    server.post<{ Params: createGameParams, Body: createGameBody }>('/api/blockchain/game/:tournamentId/:gameId', async (req: any, res: any) => {
        const credential = req.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            res.status(401).send({ error: "private_route" });
        try {
            const deployTransactionReceipt = await createGame(req.params.tournamentId, req.params.gameId);
            res.send({ status: "ok", transactionHash: deployTransactionReceipt.hash, contractAddress: deployTransactionReceipt.to });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
            res.status(500).send({ error: "0500" });
        }
    });

    interface addPointToPlayerParams {
        tournamentId: number;
        gameId: number;
        playerId: number;
    }

    interface addPointToPlayerBody {
        credential: string;
    }

    server.post<{ Params: addPointToPlayerParams, Body: addPointToPlayerBody }>('/api/blockchain/goal/:tournamentId/:gameId/:playerId', async (req: any, res: any) => {
        const credential = req.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            res.status(401).send({ error: "private_route" });
        try {
            const deployTransactionReceipt = await addPointToPlayer(req.params.tournamentId, req.params.gameId, req.params.playerId);
            res.send({ status: "ok", transactionHash: deployTransactionReceipt.hash, contractAddress: deployTransactionReceipt.to });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
            res.status(500).send({ error: "0500" });
        }
    });

    interface finishGameParams {
        tournamentId: number;
        gameId: number;
    }

    interface addPointToPlayerBody {
        credential: string;
    }

    server.post<{ Params: finishGameParams, Body: addPointToPlayerBody }>('/api/blockchain/finishGame/:tournamentId/:gameId', async (req: any, res: any) => {
        const credential = req.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            res.status(401).send({ error: "private_route" });
        try {
            const deployTransactionReceipt = await finishGame(req.params.tournamentId, req.params.gameId);
            res.send({ status: "ok", transactionHash: deployTransactionReceipt.hash, contractAddress: deployTransactionReceipt.to });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
            res.status(500).send({ error: "0500" });
        }
    });

    interface finishParams {
        tournamentId: number;
        gameId: number;
    }

    interface addPointToPlayerBody {
        credential: string;
    }

    server.post<{ Params: finishParams, Body: addPointToPlayerBody }>('/api/blockchain/finish/:tournamentId', async (req: any, res: any) => {
        const credential = req.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            res.status(401).send({ error: "private_route" });
        try {
            const deployTransactionReceipt = await finish(req.params.tournamentId);
            res.send({ status: "ok", transactionHash: deployTransactionReceipt.hash, contractAddress: deployTransactionReceipt.to });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = saveTournamentToAvalancheRoutes;