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
    
    event GameFinished(uint );

    function getPlayerScore(uint gameId, uint id) external view returns (uint) {
        require(games[gameId].exist == true, "Game not found");
        return games[gameId].playersScores[id];
    }

    function addPointToPlayer(uint gameId, uint id) external {
        require(games[gameId].exist == true, "Game not found");
        require(state == State.InProgress, "Tournament is finished");
        require(games[gameId].state == State.InProgress, "Game is finished");
        games[gameId].playersScores[id] += 1;
    }

    function getGameState(uint gameId) external view returns (State) {
        require(games[gameId].exist == true, "Game not found");
        return games[gameId].state;
    }

    function getGameById(uint gameId) external view returns (game memory) {
        require(games[gameId].exist == true, "Game not found");
        return games[gameId];
    }

    function createGame(uint gameId) external {
        require(state == State.InProgress, "Tournament is finished");
        require(games[gameId].exist == false, "Game already exists");
        games[gameId].exist = true;
        games[gameId].state = State.InProgress;
    }

    function finishGame(uint gameId) external {
        require(games[gameId].state == State.InProgress, "Game is finished");
        games[gameId].state = State.Ended;
    }

    function finish() external {
        require(state == State.InProgress, "Tournament is finished");
        state = State.Ended;
    }

    constructor() {
        console.log("constructor");
        state = State.InProgress;
    }
}