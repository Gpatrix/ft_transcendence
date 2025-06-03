import Game from "./LocalGame";
import LocalKeyLayout from "./LocalKeyLayout";
import { useState, useEffect, use } from "react";
import { useSearchParams } from "react-router";

export default function LocalGameWrapper() {
    const [userNames, setUserNames] = useState<Array<string> | null>(null)
    const [params] = useSearchParams()
    
    useEffect(()=> { // tournament
        const p1 = params.get("p1")
        const p2 = params.get("p2")

        if (!p1 || !p2)
            return ;
        setUserNames(()=> {
            return ([p1, p2])
        })
    }, [params])
    
    return (
        <div>
            { userNames && 
            <span className="w-full relative text-yellow flex">
                <h1 className="w-[234px] truncate overflow-hidden">{userNames[0]}</h1>
                <h1 className="w-[234px] truncate text-center overflow-hidden">{`VS`}</h1>
                <h1 className="w-[234px] truncate overflow-hidden text-right">{userNames[1]}</h1>
            </span>
            }
            <Game userNames={userNames} />
            <LocalKeyLayout />
        </div>
    )
}