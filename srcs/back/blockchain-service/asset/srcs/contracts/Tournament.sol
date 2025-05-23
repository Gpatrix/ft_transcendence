//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.28;

// We import this library to be able to use console.log
import "hardhat/console.sol";

enum State { InProgress, Ended, Abborted } // Enum

struct game {
    State state;
    bool exist;
    mapping(uint id => uint score) playersScores;
}

contract Tournament {
    State public state;
    mapping(uint gameId => game game) public games;
    
    event GameFinished(uint id);
    address deployer;

    modifier onlyInProgressTournament() {
        require(state == State.InProgress, "Tournament is finished");
        _;
    }

    modifier onlyInProgressGame(uint gameId) {
        require(games[gameId].state == State.InProgress, "Game is finished");
        _;
    }

    modifier onlyOwner(address sndrId) {
        require(sndrId == deployer, "Sender is not contract owner");
        _;
    }
 
    function getPlayerScore(uint gameId, uint id) external view returns (uint) {
        require(games[gameId].exist == true, "Game not found");
        return games[gameId].playersScores[id];
    }

    function addPointToPlayer(uint gameId, uint id) external onlyInProgressTournament onlyInProgressGame(gameId) onlyOwner(msg.sender) {
        require(games[gameId].exist == true, "Game not found");
        games[gameId].playersScores[id] += 1;
    }

    function getGameState(uint gameId) external onlyInProgressTournament view returns (State)  {
        require(games[gameId].exist == true, "Game not found");
        return games[gameId].state;
    }

    function createGame(uint gameId) external onlyInProgressTournament onlyOwner(msg.sender) {
        require(games[gameId].exist == false, "Game already exists");
        games[gameId].exist = true;
        games[gameId].state = State.InProgress;
    }

    function finishGame(uint gameId) external onlyInProgressGame(gameId) onlyOwner(msg.sender) {
        games[gameId].state = State.Ended;
    }

    function finish() external onlyInProgressTournament onlyOwner(msg.sender) {
        require(state == State.InProgress, "Tournament is finished");
        state = State.Ended;
    }

    constructor(address _deployer) {
        state = State.InProgress;
        deployer = _deployer;
    }
}