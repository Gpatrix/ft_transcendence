import { useState } from "react";
import ClickableIco from "../../../components/ClickableIco";
import BlankPopup from "../../../components/BlankPopup";
import { gpt } from "../../../translations/pages_reponses";

function KeyComponent({letter} : {letter : string}) {
    return (
        <span className="bg-yellow text-grey w-[70px] h-[70px] 
                           flex items-center justify-center text-[30px] rounded-2xl">
            {letter}
        </span>
    )
}

function Line({left, right, desc}: {left:string, right: string, desc:string}) {
    return (
    <span className="flex items-center mb-4">
        <KeyComponent letter={left} />
        <span className="block bg-yellow h-[1px] w-1/5"></span>
        <span className="ml-auto font-bold mr-auto uppercase">{desc}</span>
        <span className="block bg-yellow h-[1px] w-1/5"></span>
        <KeyComponent letter={right} />
    </span>
    )
}

function KeyPopup() {
    return (
    <span className="flex text-yellow px-[50px] flex-col">
        <Line left="W" right="↑" desc={gpt("up")} />
        <Line left="S" right="↓" desc={gpt("down")} />
    </span>
    )
}

export default function MultiKeyLayout() {
    const [isHelp, setIsHelp] = useState<boolean>(false);

    return (
        <div>

        { isHelp ?
            <BlankPopup  onClose={setIsHelp}>
                <KeyPopup />
            </BlankPopup>

        : <div onClick={()=> {setIsHelp(isHelp ? false : true)}} 
                 className="mt-4 justify-end flex items-center gap-4 opacity-80 cursor-pointer hover:opacity-100">
                <ClickableIco onClick={()=>{}} 
                              image="/icons/help.svg"
                              className=""
                />
                <span className="text-yellow">{gpt("keyboard_controls")}</span>
            </div>
        }
        </div>
    )
}