const path = require("path");

async function main() {
    // This is just a convenience check
    if (network?.name === "hardhat") {
      console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
  
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
    console.log(deployer);
   
    const TournamentFactory = await ethers.getContractFactory("TournamentFactory");
    const tournamentFactory = await TournamentFactory.deploy();
  
    console.log("tournamentFactory address:", tournamentFactory.target);
    saveFrontendFiles(tournamentFactory);
}

function saveFrontendFiles(tournament) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "contractData");
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ value: tournament.target }, undefined, 2)
    );
  
    const TournamentArtifact = artifacts.readArtifactSync("Tournament");
  
    fs.writeFileSync(
      path.join(contractsDir, "Tournament.json"),
      JSON.stringify(TournamentArtifact, null, 2)
    );
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});

