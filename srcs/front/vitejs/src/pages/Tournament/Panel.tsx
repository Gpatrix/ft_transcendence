    import { Link } from "react-router";
import Button from "../../components/Button";
import { useEffect, useState } from "react";

export default function Panel() {
    const [nextP1, setNextP1] = useState<string>("")
    const [nextP2, setNextP2] = useState<string>("")

    useEffect(()=>{
        const b64 = localStorage.getItem("tournament")
        if (!b64)
            return ;

        const parsed = JSON.parse(atob(b64))

        for (let i = 0; i < parsed.length; i++) {
            for (let y = 0; y < parsed[i].length; y ++) {
                if (parsed[i][y] == "") {
                    setNextP1(parsed[i-1][y * 2]);
                    setNextP2(parsed[i-1][y * 2 + 1]);
                    return;
                }
            }
        }
    }, [])

    return (
    <div className="absolute bg-grey-2 left-0 w-1/4 ml-10 h-[200px] border-1 flex flex-col border-yellow rounded-sm p-10">
        <h2 className="text-yellow font-title ml-auto mr-auto">{`${nextP1} VS ${nextP2}`}</h2>
        <Link className="w-full ml-auto mr-auto mt-auto" to={`/play/local?tournament=1&p1=${nextP1}&p2=${nextP2}`}>
            <Button className="w-full" type="full">Start</Button>
        </Link>
    </div>
    )
}