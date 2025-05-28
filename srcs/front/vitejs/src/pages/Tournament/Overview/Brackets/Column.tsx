import RightChat from "../../../Chat/RightChat";
import Pair from "./Pair";
import { useRef, useEffect, useState } from "react";

interface ColumnProps {
    players : Array<string>
    left : boolean
    right : boolean
}

export default function Column({players, left, right} : ColumnProps) {
    const pairRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [distance, setDistance] = useState<number>(0)

    useEffect(() => {
        if (pairRefs.current.length < 2) return;

        const first = pairRefs.current[0]?.getBoundingClientRect();
        const second = pairRefs.current[1]?.getBoundingClientRect();

        if (first && second) {
            console.log("DISTANCE:", second.top - first.top)
            setDistance(second.top - first.top)
        }
    }, []);

    const pairs = [];
    for (let i = 0; i < players.length; i += 2) {
        pairs.push(
            <div
                className="flex"
                key={`pair-${i}`}
                ref={(el) => (pairRefs.current[i / 2] = el)}
            >
                <Pair
                    top={players[i]}
                    bottom={players[i + 1] ?? undefined}
                    left={left}
                    right={right}
                />
            </div>
        );
    }
    
    const verticalBrackets = [];
    for (let i = 0; i < players.length; i += 2) {
        verticalBrackets.push(
            <span key={i} className="block bg-yellow" style={{height: distance ? `${distance / 2}px` : ""}}></span>
        );
    }

    return (
        <div className="flex relative">
            <span className="flex  flex-col gap-[40px] justify-around mx-[40px]">
                {pairs}
            </span>
            {
            left && 
            <span className="absolute w-[1px] h-full flex flex-col gap-[40px] justify-around ">
                {verticalBrackets}
            </span>
            }

        </div>

    )
}