import Button from "../../components/Button";
import { Dispatch } from "react";
import { SetStateAction } from "react";

interface SwitchButtonProps {
    setState : Dispatch<SetStateAction<boolean>>,
    state : boolean
}

export default function SwitchButton({ setState, state } : SwitchButtonProps) {
    return (
        <span className="flex ml-15 p-1 h-fit w-fit border border-yellow rounded-md mb-4">
            <Button className="text-sm px-[30px] border-0 mr-1" onClick={()=>setState(true)} type={state ? "full" : "stroke"} >Historique</Button>
            <Button className="text-sm px-[30px] border-0" onClick={()=>setState(false)}  type={state ? "stroke" : "full"} >Parametres</Button>
        </span>
    )
}