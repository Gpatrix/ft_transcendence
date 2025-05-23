// import ABI from "../contractData/Tournament.json";
// import ADDRESS from "../contractData/contract-address.json";
import { expect } from "chai";

describe("TournamentFactory contract", function () {
    let Tournament: any;
    let tournament: any;
    let factory: any;

    async function deployFactory() {
        const tournamentFactory = await ethers.getContractFactory("TournamentFactory");
        factory = await tournamentFactory.deploy();

        Tournament = await ethers.getContractFactory("Tournament");
    }

    it ("TournamentFactory contract should deploy", async function () {
        await deployFactory();

        const tx = await factory.deployTournament(1);
        await tx.wait();

        const result = await factory.getTournament(1);

        tournament = await Tournament.attach(result);
    });

    it("Should create a game 1 and being state 0", async function() {
        const gameTx = await tournament.createGame(1);
        expect(gameTx).to.not.be.undefined;
        await gameTx.wait();
        const state = Number(await tournament.getGameState(1));
        expect(state).to.equal(0);
    });

    it("Should add 2 points to player 1 of game 1", async function() {
        const addPointTx = await tournament.addPointToPlayer(1, 1);
        expect(addPointTx).to.not.be.undefined;
        await addPointTx.wait();
        const player1score1 = Number(await tournament.getPlayerScore(1, 1));
        expect(player1score1).to.equal(1);

        // add second point
        const addPointTx2 = await tournament.addPointToPlayer(1, 1);
        expect(addPointTx2).to.not.be.undefined;
        await addPointTx2.wait();
        const player1score2 = Number(await tournament.getPlayerScore(1, 1));
        expect(player1score2).to.equal(2);
    });

    it("Should add 1 points to player 2 of game 1", async function() {
        const addPointTx = await tournament.addPointToPlayer(1, 2);
        expect(addPointTx).to.not.be.undefined;
        await addPointTx.wait();
        const player1score1 = Number(await tournament.getPlayerScore(1, 2));
        expect(player1score1).to.equal(1);
    });
    
    it("Should end game 1 and state being 1", async function() {
        const gameTx = await tournament.finishGame(1);
        expect(gameTx).to.not.be.undefined;
        await gameTx.wait();
        const state = Number(await tournament.getGameState(1));
        expect(state).to.equal(1);
    });

    it("Should not work because game is ended", async function() {
        await expect(tournament.addPointToPlayer(1, 2)).to.be.revertedWith("Game is finished");
        const player1score1 = Number(await tournament.getPlayerScore(1, 2));
        expect(player1score1).to.equal(1);
    });
});