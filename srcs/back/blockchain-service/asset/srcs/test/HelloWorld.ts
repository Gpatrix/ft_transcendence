import { expect } from "chai";
import hre from "hardhat";
import fs from "fs";
import path from 'path';
var { ethers } = hre;

// describe("HelloWorld contract", function () {
//   it("Deployment should set the initial message", async function () {
//     const [owner] = await ethers.getSigners();

//     const HelloWorld = await ethers.getContractFactory("HelloWorld");

//     const initialMessage = "Hello World!";
//     const helloWorldContract = await HelloWorld.deploy(initialMessage);

//     expect(await helloWorldContract.message()).to.equal(initialMessage);
//   });

//   it("Updating overwrites the message", async function () {
//     const [owner, user1, user2] = await ethers.getSigners();

//     const HelloWorld = await ethers.getContractFactory("HelloWorld");
//     const helloWorldContract = await HelloWorld.deploy("I'm first");

//     await helloWorldContract.connect(user1).update("This is user 1")
//     expect(await helloWorldContract.message()).to.equal("This is user 1");

//     await helloWorldContract.connect(user2).update("It's user1 no more")
//     expect(await helloWorldContract.message()).to.equal("It's user1 no more");
//   });
// });

describe("TournamentFactory contract", function () {
  let Tournament: any;
  let tournamentFactory: BaseContract;
  const contractsDir = path.join(__dirname, "..", "contractData", "contract-address.json");
  let factoryAddress: string;
  fs.readFile(contractsDir, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return ;
    }
    factoryAddress = JSON.parse(factoryAddress)?.value;
    if (!factoryAddress)
      return ;
  });

  it("TournamentFactory contract should deploy first TournamentSmartContract and retrieve 'ChildCreated' event", async function () {
    const tournamentId = 1;
    const tx: ContractTransactionResponse = await tournamentFactory.deploy(1);

    expect(tx).to.not.equal(undefined);

    const receipt: ContractTransactionReceipt = await tx.wait(1);

    expect(receipt).to.not.equal(undefined);

    const event = receipt.logs.find((log: any) => log.fragment.name == "TournamentCreated");
    const data: Result = event.args;
    const dataTournamentId = Number(data[0]);
    const dataTournamentAddress = String(data[1]);

    expect(dataTournamentId).to.equal(tournamentId);
    expect(dataTournamentAddress).to.not.equal(undefined);
    console.log(`Tournament created with id: ${data[0]} at address: ${data[1]}`);
  });

  it("TournamentFactory contract should return tournament by id", async function () {
    const tournamentId = 1;
    const tournamentAddress = await tournamentFactory.getTournament(tournamentId);
    const tournamentContract = await Tournament.attach(tournamentAddress);
    const nonParsedScore = await tournamentContract.getPlayerScore(1);
    const score = Number(nonParsedScore);
    expect(score).to.equal(42);
    console.log(`Tournament with id: ${tournamentId} has player with id: 1 and score: ${score}`);
  });
});
