import RightChat from "../../../Chat/RightChat";
import Pair from "./Pair";
import { useEffect, useRef, useState } from "react";

interface ColumnProps {
    players : Array<string>
    left : boolean
    right : boolean
}

export default function Column({players, left, right} : ColumnProps) {
    const first = useRef<HTMLDivElement | null>(null);
    const second = useRef<HTMLDivElement | null>(null);
    const [distance, setDistance] = useState<number>(0)

    const pairs = [];
    for (let i = 0; i < players.length; i += 2) {
        pairs.push(
            <div
                className="flex relative"
                key={`pair-${i}`}
                ref={i == 0 ? first : (i == 2 ? second : undefined)}
            >
                <Pair
                    top={players[i]}
                    bottom={players[i + 1] ?? undefined}
                    left={left}
                    right={right}
                    distance={distance}
                />
                {!(i % 4) &&  <span className="absolute left-[126%] top-[30px] bg-yellow w-[1px]" 
                style={
                    {height: `${distance}px` }
                }></span>}
            </div>
        );
    }
    
    useEffect(()=> {
        const firstRect = first.current?.getBoundingClientRect()
        const secondRect = second.current?.getBoundingClientRect()

        if (!firstRect || !secondRect)
            return ;
        // console.log("FIRST: ", firstRect)
        // console.log("SECOND: ", secondRect)

        console.log("DISTANCE: ", secondRect.y - firstRect.y)
        setDistance(secondRect.y - firstRect.y)
    }, [])

    return (
        <div className="flex relative">
            <span className="flex  flex-col gap-[40px] justify-around mx-[40px]">
                {pairs}
            </span>
        </div>

    )
}