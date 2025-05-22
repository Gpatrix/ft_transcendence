//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.28;

// We import this library to be able to use console.log
import "hardhat/console.sol";

import "./Tournament.sol";

contract TournamentFactory {
    event TournamentCreated(uint tournamentId, address tournamentAddress);

    mapping(uint => address) public tournaments;

    function deployTournament(uint tournamentId) external {
        console.log("Deploying tournament with ID: ", tournamentId);
        Tournament newTournament = new Tournament();
        tournaments[tournamentId] = address(newTournament);
        console.log("Tournament deployed at address: ", address(newTournament));
        emit TournamentCreated(tournamentId, tournaments[tournamentId]);
    }

    function getTournament(uint tournamentId) external view returns (address) {
        // require(tournaments[tournamentId] != address(0), "Tournament not found");
        return tournaments[tournamentId];
    }
}
