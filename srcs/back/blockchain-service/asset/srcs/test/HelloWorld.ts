import { expect } from "chai";
import hre from "hardhat";
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
  let tournamentFactoryFactory: any;
  let tournamentFactoryContract: any;
  let tournamentCreationTransaction: any;
  let tournamentContract: any
  it("Should get factory of TournamentFactory contract and deploy it", async function () {
    tournamentFactoryFactory = await ethers.getContractFactory("TournamentFactory");
    expect(tournamentFactoryFactory).to.not.equal(undefined);
    console.log('tournamentFactory signer address:', tournamentFactoryFactory.runner.address);

    tournamentFactoryContract = await tournamentFactoryFactory.deploy();
    expect(tournamentFactoryContract).to.not.equal(undefined);
    console.log("TournamentFactory contract deployed to:", tournamentFactoryContract.target);
  });

  it("TournamentFactory contract should deploy first TournamentSmartContract", async function () {
    tournamentCreationTransaction = await tournamentFactoryContract.deploy([
      {
        id: 1,
        score: 42
      },
      {
        id: 2,
        score: 42
      }
    ], 1);
    expect(tournamentContract).to.not.equal(undefined);
    tournamentContract = await tournamentCreationTransaction.wait();
    tournamentContract = tournamentContract.events[0].address;
    expect(tournamentContract).to.not.equal(undefined);
    console.log("TournamentSmartContract transaction events[0].address:", tournamentCreationTransaction.events[0].address);
    console.log("TournamentSmartContract deployed to:", tournamentContract);
  });
});
