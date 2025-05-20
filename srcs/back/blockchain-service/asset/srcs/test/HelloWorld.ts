import { expect } from "chai";
import hre from "hardhat";
var { ethers } = hre;

describe("HelloWorld contract", function () {
  it("Deployment should set the initial message", async function () {
    const [owner] = await ethers.getSigners();

    const HelloWorld = await ethers.getContractFactory("HelloWorld");

    const initialMessage = "Hello World!";
    const helloWorldContract = await HelloWorld.deploy(initialMessage);

    expect(await helloWorldContract.message()).to.equal(initialMessage);
  });

  it("Updating overwrites the message", async function () {
    const [owner, user1, user2] = await ethers.getSigners();

    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorldContract = await HelloWorld.deploy("I'm first");

    await helloWorldContract.connect(user1).update("This is user 1")
    expect(await helloWorldContract.message()).to.equal("This is user 1");

    await helloWorldContract.connect(user2).update("It's user1 no more")
    expect(await helloWorldContract.message()).to.equal("It's user1 no more");
  });
});

describe("Tournament contract", function () {
  it("TournamentFactory should be instanced and TournamentFactory should instance Tournament", async function () {
    const [owner] = await ethers.getSigners();

    const tournamentFactoryFactory = await ethers.getContractFactory("TournamentFactory");

    const tournamentFactory = await tournamentFactoryFactory.deploy();

    expect(await tournamentFactory.deploy([
      {
        id: 1,
        score: 42
      },
      {
        id: 2,
        score: 42
      }
    ], 1));
  });

  it("Updating overwrites the message", async function () {
    const [owner, user1, user2] = await ethers.getSigners();

    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorldContract = await HelloWorld.deploy("I'm first");

    await helloWorldContract.connect(user1).update("This is user 1")
    expect(await helloWorldContract.message()).to.equal("This is user 1");

    await helloWorldContract.connect(user2).update("It's user1 no more")
    expect(await helloWorldContract.message()).to.equal("It's user1 no more");
  });
});
