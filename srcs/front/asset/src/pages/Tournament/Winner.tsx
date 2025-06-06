import { Link } from "react-router"
import Button from "../../components/Button"
import { gpt } from "../../translations/pages_reponses"

interface WinnerProps  {
    name: string
}

export default function Winner({name}: WinnerProps) {
    return (
    <div className="absolute bg-grey-2 right-0 w-1/4 ml-10  border-1 flex flex-col border-yellow rounded-sm p-10">
        <h2 className="text-yellow font-title w-full truncate ml-auto mr-auto text-2xl">{name}</h2>
        <h2 className="text-yellow font-title ml-auto mr-auto">{gpt("won_the_tournament")}</h2>
        <Link to={"/"} onClick={()=> {
            localStorage.removeItem("tournament")
        }}>
        <Button type="full" className="w-full mt-8">{gpt("back_to_home")}</Button>
        </Link>
    </div>
    )
}