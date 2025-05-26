import { FastifyInstance } from "fastify";
import { ethers } from "ethers";
import addressData from "../contractData/contract-address.json";
import abiData from "../contractData/TournamentFactory.json"; 

const HARDHAT_RPC_URL = "http://0.0.0.0:8545/";
const factoryAddress = addressData.value;
const factoryABI = abiData.abi;
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
    return provider;
}

function getDeployer(): ethers.Wallet
{
    const provider = getProvider();
    return new ethers.Wallet(owner, provider);
}

function getFactory(): ethers.Contract
{
    const wallet = getDeployer();
    return new ethers.Contract(factoryAddress, factoryABI, wallet);
}

async function deployTournament(tournamentId: number): Promise<ethers.ContractTransactionReceipt>
{
    const factory = getFactory();
    const tx = await factory.deployTournament(1);
    const receipt = await tx.wait();    
    console.log(receipt);
    return (receipt);
}



function saveTournamentToAvalancheRoutes (server: FastifyInstance, options: any, done: any)
{
    interface deployTournamentParams {
        tournamentId: number;
    }

    server.get<{ Params: deployTournamentParams }>('/api/blockchain/deploy/:tournamentId', async (req: any, res: any) => {
        try {
            const deployTransactionReceipt = await deployTournament(req.params.tournamentId);
            res.send({ status: "ok", txHash: deployTransactionReceipt.hash, contractAddress: deployTransactionReceipt.to });
        } catch (error) {
            console.error("Error ", error);
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = saveTournamentToAvalancheRoutes;