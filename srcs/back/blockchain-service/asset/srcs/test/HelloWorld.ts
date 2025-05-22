// import ABI from "../contractData/Tournament.json";
// import ADDRESS from "../contractData/contract-address.json";
import { expect } from "chai";

describe("TournamentFactory contract", function () {
    let Tournament: unknown;
    let factory: unknown;


    async function deployFactory() {
        const tournamentFactory = await ethers.getContractFactory("TournamentFactory");
        factory = await tournamentFactory.deploy();

        Tournament = await ethers.getContractFactory("Tournament");
    }

    it("TournamentFactory contract should deploy first TournamentSmartContract and retrieve 'ChildCreated' event", async function () {
        await deployFactory();

        factory.on("TournamentCreated", (id, addr) => {
            console.log(`✅ Tournoi ${id.toString()} créé à l'address ${addr}`);
        });

        const tx = await factory.deployTournament(1);
        await tx.wait();

        const result = await factory.getTournament(1);

        const tournament = await Tournament.attach(result);
        const tx2 = await tournament.createGame(1);
        await tx2.wait();
        const game = await tournament.getGameState(1);
        console.log(`Game ${game.toString()} created at address ${game}`);

        console.log(result);
    });
});