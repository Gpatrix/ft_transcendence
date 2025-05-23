import { FastifyInstance } from "fastify";
import { ethers } from "ethers";
import addressData from "../contractData/contract-address.json";
import abiData from "../contractData/Tournament.json"; 

const HARDHAT_RPC_URL = "http://0.0.0.0:8545/";
const factoryAddress = addressData.value;
const factoryABI = abiData.abi;
let     rpcURL : string = process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";

if (process.env.NODE_ENV == "dev")
    rpcURL = HARDHAT_RPC_URL;



function saveTournamentToAvalancheRoutes (server: FastifyInstance, options: any, done: any)
{
    
    server.get('/api/blockchain/ping', async (req: any, res: any) => {
        try {
            const provider = new ethers.JsonRpcProvider(rpcURL);
            const wallet = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY || "", provider);

            console.log(abiData)
            // this create a contract instance connected to the provider
            const factoryContract = new ethers.Contract(factoryAddress, factoryABI, wallet);
            console.log("factoryContract", factoryContract);
            const theCtrctAddr = await factoryContract.getTournament(1);
            console.log("factoryContract", theCtrctAddr);
        } catch (error) {
            console.error("Error ", error);
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = saveTournamentToAvalancheRoutes;