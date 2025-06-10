import BgShadow from "../../../../components/BgShadow"
import Button from "../../../../components/Button";
import { Link } from 'react-router-dom';
import { gpt } from "../../../../translations/pages_reponses";
import {useState, useEffect} from "react";

interface PlayerData {
    id: number;
    score: number;
    position: {
        x: number;
        y: number;
    };
    isYours: boolean;
}

interface EndPopupProps {
    array: PlayerData[];
    points: Array<number>;
}


export default function EndPopup({array, points}: EndPopupProps) {
    const [isWinner, setIsWinner] = useState<boolean>(true)

    useEffect(() => {
        console.log("ARRAY", array);
        console.log("POINTS", points);

        const you = array.find(element => element.isYours);
        if (!you) return;

        const yourIndex = array.indexOf(you);
        if (yourIndex === -1) return;

        const yourScore = points[yourIndex];
        if (yourScore === undefined) return;

        let winner = true;
        for (const score of points) {
            if (score > yourScore) {
                winner = false;
                break;
            }
        }

        setIsWinner(winner);
    }, [array, points]);


    return (
        <div className="w-[100vh] h-[50vh] top-0 flex items-center justify-center">
        <BgShadow className="z-100  backdrop-blur-xl rounded-none flex flex-col justify-center items-center w-[500px] gap-8">
            <h1 className=" ml-auto mr-auto text-yellow mt-auto mb-auto w-full text-2xl text-center">
                {isWinner 
                ? gpt("you_win") 
                : gpt("you_lose") 
                } 
            </h1>

            <span className="flex flex-col gap-3 w-full">
                <Link to='/lobby/matchmaking' className="w-full">
                    <Button type="full" className="w-full">{gpt("replay")}</Button>
                </Link> 
                <Link to='/' className="w-full">
                    <Button className="w-full">{gpt("back_to_home")}</Button>
                </Link>
            </span>
        </BgShadow>
        </div>

    )
}