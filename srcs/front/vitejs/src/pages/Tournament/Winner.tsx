import { Link } from "react-router"
import Button from "../../components/Button"

interface WinnerProps  {
    name: string
}

export default function Winner({name}: WinnerProps) {
    return (
    <div className="absolute bg-grey-2 right-0 w-1/4 ml-10  border-1 flex flex-col border-yellow rounded-sm p-10">
        <h2 className="text-yellow font-title w-full truncate ml-auto mr-auto text-2xl">{name}</h2>
        <h2 className="text-yellow font-title ml-auto mr-auto">Won the tournament!!</h2>
        <Link to={"/"} onClick={()=> {
            localStorage.removeItem("tournament")
        }}>
        <Button type="full" className="w-full mt-8">Home</Button>
        </Link>
    </div>
    )
}