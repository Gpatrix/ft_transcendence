import path from 'path';
import fs from 'fs';

async function main() {
  
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
    console.log(deployer);
   
    const TournamentFactoryFactory = await ethers.getContractFactory("TournamentFactory");
    const tournamentFactory = await TournamentFactoryFactory.deploy();

    console.log("TournamentFactory deployed to:", tournamentFactory.target);
  
    saveFrontendFiles(tournamentFactory);
}

function saveFrontendFiles(tournament) {
    const contractsDir = path.join(__dirname, "..", "contractData");
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ value: tournament.target }, undefined, 2)
    );
  
    const TournamentArtifact = artifacts.readArtifactSync("Tournament");
    const TournamentFactoryArtifact = artifacts.readArtifactSync("TournamentFactory");
  
    fs.writeFileSync(
      path.join(contractsDir, "Tournament.json"),
      JSON.stringify(TournamentArtifact, null, 2)
    );

    fs.writeFileSync(
      path.join(contractsDir, "TournamentFactory.json"),
      JSON.stringify(TournamentFactoryArtifact, null, 2)
    );
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});

