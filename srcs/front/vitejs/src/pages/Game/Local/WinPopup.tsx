import { useEffect, useState } from "react"
import { SetStateAction } from "react"
import { Dispatch } from "react"
import PointsCounter from "./PointsCounter"
import Button from "../../../components/Button"
import { Link } from "react-router"

type WinPopUpProperties = {
    userNames: Array<string> | null
    scores: Array<number>

}
export default function WinPopUp({userNames, scores}: WinPopUpProperties) {
    const [winnerIndex, setWinnerIndex] = useState<number>(0)

    useEffect(()=>{
        const index = scores[0] > scores[1] ? 1 : 0
        setWinnerIndex(index)

        if (userNames) {
            const storage = localStorage.getItem("tournament")
            if (!storage)
                return 
            const parsed = JSON.parse(atob(storage))
            for (let i = 0; i < parsed.length; i++) {
                for (let y = 0; y < parsed[i].length; y ++) {
                    if (parsed[i][y] == "") {
                        parsed[i][y] = userNames[index]
                        const b64 = btoa(JSON.stringify(parsed))
                        localStorage.setItem("tournament", b64)
                        return ;
                    }
                }
            }
        }

    }, [])

    return (
        <div className="text-yellow font-title relative flex  backdrop-blur-xs z-100 h-[500px]  shadow-yellow flex-col" style={{
        }}>
            <span   className="font-title ml-auto mr-auto mb-auto mt-auto text-center flex flex-col truncate w-[700px] px-10"
                    style={{fontSize : "200%"}}>
            <span className="font-title w-full truncate">{ userNames != null ? userNames[winnerIndex] : `P${winnerIndex + 1}`}</span>
            <span className="font-title w-full ">Won the game!</span>
            </span>


            { !userNames &&  // local
            <span className="flex flex-col mb-19 w-full">
                <Link className="w-full mb-5 flex flex-col justify-between" to="/replay">
                    <Button type="full" className="w-1/2 ml-auto mr-auto mb-2" onClick={()=>{window.location.reload()}}>Replay</Button>            
                </Link>

                <Link className="w-full mb-5 flex flex-col justify-between" to="/">
                    <Button className="w-1/2 ml-auto mr-auto mb-2">Home</Button>            
                </Link>
            </span>}
        
            { userNames &&  // tournament
            <span className="flex flex-col mb-19 w-full">
                <Link className="w-full mb-5 flex flex-col justify-between" to="/play/tournament/overview">
                    <Button type="full" className="w-1/2 ml-auto mr-auto mb-2">Continue</Button>            
                </Link>
            </span>}
                
        </div>)
}