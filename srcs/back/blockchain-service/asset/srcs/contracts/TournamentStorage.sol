//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.28;

// We import this library to be able to use console.log
import "hardhat/console.sol";

struct IdScorePair {
    uint256 id;
    uint256 score;
}

contract Tournament {
    uint256 public endedAt;
    mapping(uint256 id => uint256 score) public playersScores;

    function getPlayerScore(uint256 id) external view returns (uint256) {
        return playersScores[id];
    }

    constructor(IdScorePair[] memory pairs) {
        for (uint256 i = 0; i < pairs.length; i++)
        {
            playersScores[pairs[i].id] = pairs[i].score;
        }
    }
}

contract TournamentFactory {
    event TournamentCreated(uint256 tournamentId, address tournamentAddress);
    mapping(uint256 => Tournament) public tournaments;

    function deploy(IdScorePair[] calldata pairs, uint256 tournamentId) external {
        tournaments[tournamentId] = new Tournament(pairs);
        emit TournamentCreated(tournamentId, address(tournaments[tournamentId]));
    }

    function getTournamentAddress(uint256 tournamentId) external view returns (address) {
        return address(tournaments[tournamentId]);
    }

    function getTournament(uint256 tournamentId) external view returns (Tournament) {
        return tournaments[tournamentId];
    }
}
