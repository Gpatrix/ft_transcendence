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

    constructor(IdScorePair pairs[]) public {
        for (uint256 i - 0; i < pairs.length; i++)
        {
            playersScores[pairs[i].id] = pairs[i].score;
        }
    }
}

contract TournamentFactory {
    mapping(address => Tournament) public tournaments;

    constructor() public {
    }

    function deploy(IdScorePair pairs[], tournamentId) external {
        tournaments[tournamentId] = new Tournament(pairs);
    }
}
