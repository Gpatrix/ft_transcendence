import { useEffect, useState } from "react"
import { SetStateAction } from "react"
import { Dispatch } from "react"
import PointsCounter from "./PointsCounter"

type StartCounterProperties = {
    counter: string,
    setCounter : Dispatch<SetStateAction<string | null>>
    width: number
    height: number
}
export default function StartCounter({counter, setCounter, width, height}: StartCounterProperties) {
    const [counting, setCounting] = useState(false)
    const handleStartCounter = (e : KeyboardEvent) => {
        if (e.key == ' ') {
            setCounting(true)
            for (let i = 3; i > 0; i--) {
                setTimeout(() => {
                    setCounter(String(i));
                }, (3 - i) * 1000);
            }
            setCounting(false)
            window.removeEventListener("keydown", handleStartCounter);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleStartCounter);
    }, []);

    return (
        <div className="text-yellow font-title relative flex  backdrop-blur-xs z-100  shadow-yellow" style={{
            width: width,
            height: height 
        }}>
            <span   className="font-title ml-auto mr-auto mb-auto mt-auto text-center"
                    style={{fontSize : (counting ? "100px" : "300%")}}>
                {counter}
            </span>
        </div>)
}