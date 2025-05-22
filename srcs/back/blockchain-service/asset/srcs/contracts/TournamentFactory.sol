//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.28;

// We import this library to be able to use console.log
import "hardhat/console.sol";

import "./Tournament.sol";

contract TournamentFactory {
    event TournamentCreated(uint tournamentId, address tournamentAddress);

    mapping(uint => Tournament) public tournaments;

    function deploy(uint tournamentId) external {
        tournaments[tournamentId] = new Tournament();
        emit TournamentCreated(tournamentId, address(tournaments[tournamentId]));
    }

    function getTournamentAddress(uint tournamentId) external view returns (address) {
        return address(tournaments[tournamentId]);
    }

    function getTournament(uint tournamentId) external view returns (Tournament) {
        return tournaments[tournamentId];
    }
}
