import { Link } from "react-router";
import BgShadow from "../../components/BgShadow";
import Button from "../../components/Button";
import AuthLayout from "../Auth/AuthLayout";
import Login from "../Auth/Login";
import ProfileBackground from "../Profile/ProfileBackground";

export default function AskPlayers() {
    return (
        <div className="rounded-xl border-1 border-yellow w-[500px] flex flex-col items-center p-10">
            <h1 className="text-yellow mb-10">Tournament</h1>
            <span className="flex flex-col gap-9 w-[400px]">
            {(() => {
                let rows = [];
                for (let i = 4; i <= 16; i+= i ) {
                  rows.push(
                    <Link key={i} to={`/play/tournament/create?players=${i}`}>
                        <Button className="w-full uppercase font-title hover:bg-yellow hover:text-grey">
                            {i} players
                        </Button>
                    </Link>
                    );
                }
                return rows;
            })()}

                {/* <Button className="w-full font-title hover:bg-yellow hover:text-grey" >4 players</Button>
                <Button className="w-full font-title hover:bg-yellow hover:text-grey" >6 players</Button>
                <Button className="w-full font-title hover:bg-yellow hover:text-grey" >8 players</Button>
                <Button className="w-full font-title hover:bg-yellow hover:text-grey" >10 players</Button> */}
            </span>
        </div>
    )
}