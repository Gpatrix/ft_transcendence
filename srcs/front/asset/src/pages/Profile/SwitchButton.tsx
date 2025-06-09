import Button from "../../components/Button";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { gpt } from "../../translations/pages_reponses";

interface SwitchButtonProps {
    setState : Dispatch<SetStateAction<boolean>>,
    state : boolean
}

export default function SwitchButton({ setState, state } : SwitchButtonProps) {
    return (
        <span className="flex xl:ml-15 p-1 h-fit w-fit border border-yellow rounded-md mb-4 mt-4 md:mb-0 md:mt-0">
            <Button className="text-sm px-[30px] border-0 mr-1" onClick={()=>setState(true)} type={state ? "full" : "stroke"} >{gpt("history")}</Button>
            <Button className="text-sm px-[30px] border-0" onClick={()=>setState(false)}  type={state ? "stroke" : "full"} >{gpt("parameters")}</Button>
        </span>
    )
}