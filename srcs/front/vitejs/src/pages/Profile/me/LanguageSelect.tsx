import FlagIcons from "./FlagsIcon"
import { LabelHTMLAttributes, SetStateAction } from "react";

interface LanguageSelectProps {
    setValue: (value: number) => void;
    lang : number | null,
    init : number | null
    resetInit: () => void;
}

export default function LanguageSelect({setValue, lang, init, resetInit} : LanguageSelectProps) {
    const keys =    ["great-britain",
                     "france",
                     "italy",]
    console.log(`init : ${init}`)
    return (
        <span className="flex  ml-auto mr-auto mb-5">
            {keys.map((key, i) => 
                <img    key={key}
                        onClick={()=>{
                            setValue(i)
                            resetInit()
                        }} 
                        className={ ((i == init && lang == null) || i == lang) ? "" : "opacity-45 hover:opacity-100"} 
                        src={`https://img.icons8.com/color/48/${keys[i]}-circular.png`} />
            )}
        </span>
    )
}


// type FlagIconsProps = {
//     lang : number,
//     isActive : boolean,
//     onClick?: React.MouseEventHandler<HTMLButtonElement>;
// }

// export default function FlagIcons({lang, isActive} : FlagIconsProps) {

                    
//     return (
//             <img  className={isActive ? "" : "opacity-45 hover:opacity-100"} src={`https://img.icons8.com/color/48/${keys[lang]}-circular.png`}/>
//     )
// }