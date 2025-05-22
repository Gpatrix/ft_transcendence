import { setTimeout } from "timers";
import WebSocket from 'ws';

export class MatchMakingUser {
    constructor(id: number, rank: number, websocket: WebSocket) {
        this.id = id;
        this.rank = rank;
        this.waitFrom = new Date(Date.now());
        this.websocket = websocket;
    }
    
    id: number;
    rank: number;
    waitFrom: Date;
    websocket: WebSocket;
}

export interface MatchResult {
    users: MatchMakingUser[];
    roomId: string;
}

export class MatchMakingMap {
    private queue: MatchMakingUser[] = [];
    private playerCount: number = 2;
    private activeRooms: Set<string> = new Set();
    private playerRooms: Map<number, string> = new Map();
    private matchingDelay: number = 1000;
    private maxRankDifference: number = 1000;
    private waitTimeExpansion: number = 30000;

    constructor(playerCount: number = 2, maxRankDifference: number = 1000) {
        this.playerCount = playerCount;
        this.maxRankDifference = maxRankDifference;
    }

    private generateRoomId(): string {
        return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private isUserInActiveRoom(userId: number): boolean {
        return this.playerRooms.has(userId);
    }

    private addUserToRoom(userId: number, roomId: string): void {
        this.playerRooms.set(userId, roomId);
        this.activeRooms.add(roomId);
    }

    private removeUserFromRoom(userId: number): void {
        const roomId = this.playerRooms.get(userId);
        if (roomId) {
            this.playerRooms.delete(userId);
            const playersInRoom = Array.from(this.playerRooms.values()).filter(r => r === roomId);
            if (playersInRoom.length === 0) {
                this.activeRooms.delete(roomId);
            }
        }
    }

    private getMaxRankDifferenceForUser(user: MatchMakingUser): number {
        const waitTime = Date.now() - user.waitFrom.getTime();
        const expansionFactor = Math.floor(waitTime / this.waitTimeExpansion);
        return this.maxRankDifference * (1 + expansionFactor);
    }

    private findBestMatches(targetUser: MatchMakingUser): MatchMakingUser[] {
        const maxRankDiff = this.getMaxRankDifferenceForUser(targetUser);
        
        const eligibleUsers = this.queue.filter(user => {
            const rankDiff = Math.abs(user.rank - targetUser.rank);
            return rankDiff <= maxRankDiff;
        });

        const sortedUsers = eligibleUsers
            .map(user => ({
                user,
                rankDiff: Math.abs(user.rank - targetUser.rank),
                waitTime: Date.now() - user.waitFrom.getTime()
            }))
            .sort((a, b) => {
                if (a.rankDiff !== b.rankDiff) {
                    return a.rankDiff - b.rankDiff;
                }
                return b.waitTime - a.waitTime;
            })
            .slice(0, this.playerCount)
            .map(item => item.user);

        return sortedUsers;
    }

    private extractUsersFromQueue(usersToExtract: MatchMakingUser[]): void {
        const idsToRemove = new Set(usersToExtract.map(u => u.id));
        this.queue = this.queue.filter(user => !idsToRemove.has(user.id));
    }

    private canFormMatch(): boolean {
        if (this.queue.length < this.playerCount) {
            return false;
        }

        const firstUser = this.queue[0];
        const potentialMatches = this.findBestMatches(firstUser);
        
        return potentialMatches.length >= this.playerCount;
    }

    async addUserToMatchmaking(user: MatchMakingUser): Promise<MatchResult | undefined> {
        if (this.isUserInActiveRoom(user.id)) {
            return undefined;
        }

        const existingUserIndex = this.queue.findIndex(u => u.id === user.id);
        if (existingUserIndex !== -1) {
            return undefined;
        }

        this.queue.push(user);

        if (this.canFormMatch()) {
            if (this.queue.length === this.playerCount) {
                await new Promise(resolve => setTimeout(resolve, this.matchingDelay));
            }

            if (this.queue.length >= this.playerCount) {
                const firstUser = this.queue[0];
                const matchedUsers = this.findBestMatches(firstUser);

                if (matchedUsers.length >= this.playerCount) {
                    this.extractUsersFromQueue(matchedUsers);

                    const roomId = this.generateRoomId();
                    matchedUsers.forEach(u => this.addUserToRoom(u.id, roomId));
                    
                    return {
                        users: matchedUsers,
                        roomId: roomId
                    };
                }
            }
        }

        return undefined;
    }

    removeUserFromQueue(userId: number): boolean {
        const index = this.queue.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.queue.splice(index, 1);
            return true;
        }
        return false;
    }

    handleUserDisconnection(userId: number): void {
        this.removeUserFromQueue(userId);
        this.removeUserFromRoom(userId);
    }

    getUserStatus(userId: number): {
        inQueue: boolean;
        queuePosition: number;
        inRoom: boolean;
        roomId?: string;
        estimatedWaitTime?: number;
    } {
        const queueIndex = this.queue.findIndex(u => u.id === userId);
        const roomId = this.playerRooms.get(userId);
        
        let estimatedWaitTime: number | undefined;
        if (queueIndex !== -1) {
            const user = this.queue[queueIndex];
            const waitTime = Date.now() - user.waitFrom.getTime();
            estimatedWaitTime = Math.max(0, (queueIndex + 1) * this.matchingDelay - waitTime);
        }

        return {
            inQueue: queueIndex !== -1,
            queuePosition: queueIndex,
            inRoom: !!roomId,
            roomId: roomId,
            estimatedWaitTime: estimatedWaitTime
        };
    }

    getQueueStats(): {
        totalUsers: number;
        averageWaitTime: number;
        activeRooms: number;
        queueDistribution: { [rank: string]: number };
    } {
        const now = Date.now();
        const waitTimes = this.queue.map(user => now - user.waitFrom.getTime());
        const averageWaitTime = waitTimes.length > 0 
            ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length 
            : 0;

        const queueDistribution: { [rank: string]: number } = {};
        this.queue.forEach(user => {
            const rankBracket = Math.floor(user.rank / 100) * 100;
            const key = `${rankBracket}-${rankBracket + 99}`;
            queueDistribution[key] = (queueDistribution[key] || 0) + 1;
        });

        return {
            totalUsers: this.queue.length,
            averageWaitTime: averageWaitTime,
            activeRooms: this.activeRooms.size,
            queueDistribution: queueDistribution
        };
    }

    cleanupInactiveRooms(): void {
        const activeUserRooms = new Set(Array.from(this.playerRooms.values()));
        this.activeRooms.forEach(roomId => {
            if (!activeUserRooms.has(roomId)) {
                this.activeRooms.delete(roomId);
            }
        });
    }

    get length(): number {
        return this.queue.length;
    }

    findIndex(predicate: (user: MatchMakingUser) => boolean): number {
        return this.queue.findIndex(predicate);
    }
}

module.exports = {
    MatchMakingUser,
    MatchMakingMap
}