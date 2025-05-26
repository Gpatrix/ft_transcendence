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

function saveTournamentToAvalancheRoutes (server: FastifyInstance, options: any, done: any)
{
    
    server.get('/api/blockchain/ping', async (req: any, res: any) => {
        try {
            const provider = new ethers.JsonRpcProvider(rpcURL);
            const wallet = new ethers.Wallet(owner, provider);

            // this create a contract instance connected to the provider
            const factory = new ethers.Contract(factoryAddress, factoryABI, wallet);
            ethers.formatet
            const balance = await provider.getBalance(wallet.address);
            console.log("balance: ", ethers.utils.formatEther(balance));
            const tx = await factory.deployTournament(1);
            const receipt = await tx.wait();
            console.log("balance after deploy: ", await provider.getBalance(wallet.address).formatEther());
            res.send({ status: "ok", txHash: receipt.transactionHash });
        } catch (error) {
            console.error("Error ", error);
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = saveTournamentToAvalancheRoutes;