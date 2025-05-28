import Pair from "./Pair";

interface ColumnProps {
    players : Array<string>
}

export default function Column({players} : ColumnProps) {
    const pairs = [];
    for (let i = 0; i < players.length; i += 2) {
        pairs.push(
            <Pair
                key={i}
                top={players[i]}
                bottom={players[i + 1] ?? undefined}
            />
        );
    }

    return (
        <span className="flex flex-col gap-[40px] justify-around mx-[40px]">
            {pairs}
        </span>
    )
}