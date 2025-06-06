export function parseGamesJson(gamesJson: string | object): Map<number, Array<number>> {
    try {
        let games: object | undefined = undefined;

        if (typeof gamesJson === 'string')
            games = JSON.parse(gamesJson);
        else if (typeof gamesJson === 'object')
            games = gamesJson as object;
        else
            throw new Error('Invalid JSON format');
        if (games === undefined) {
            throw new Error('Invalid JSON format');
        }

        const gamesMap = new Map<number, Array<number>>();

        Object.entries(games).forEach(([key, value]) => {
            if (!Array.isArray(value))
                throw new Error('Invalid JSON format');
            if (value.some((number: number) => typeof number != 'number'))
                throw new Error('Invalid JSON format');
            gamesMap.set(Number(key), value)
        });
        return (gamesMap);
    } catch (error) {
        console.error('Error parsing games JSON:', error);
        throw new Error('Error parsing games JSON:' + error);
    }
}

export function stringifiyGamesJson(games: Map<number, Array<number>>): string {
    const gamesObject: { [key: number]: Array<number> } = {};
    games.forEach((value, key) => {
        gamesObject[key] = value;
    });
    return JSON.stringify(gamesObject);
}
