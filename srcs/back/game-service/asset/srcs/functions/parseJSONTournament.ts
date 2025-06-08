export function parseGamesJson(gamesJson: string | object): Map<number, Array<number>> {
    try {
        let games: object | undefined = undefined;

        if (typeof gamesJson === 'string')
            games = JSON.parse(gamesJson);
        else if (typeof gamesJson === 'object')
            games = gamesJson as object;
        else
            throw new Error('Invalid JSON format (games not of type string or object)');
        if (games === undefined) {
            throw new Error('Invalid JSON format (games == undefined)');
        }

        const gamesMap = new Map<number, Array<number>>();

        Object.entries(games).forEach(([key, value]) => {
            const objectValues = Object.values(value).map(stringValue => Number(stringValue));
            const values: Array<number> = Array<number>(...objectValues);
            if (values.some((number: number) => typeof number != 'number'))
                throw new Error('Invalid JSON format (values is not a number)' + values);
            gamesMap.set(Number(key), values)
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
