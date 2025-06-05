type FlagIconsProps = {
    lang : number,
    isActive : boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function FlagIcons({lang, isActive} : FlagIconsProps) {
    const keys =    ["great-britain",
                    "france",
                    "italy",]
                    
    return (
            <img  className={isActive ? "" : "opacity-45 hover:opacity-100"} src={`https://img.icons8.com/color/48/${keys[lang]}-circular.png`}/>
    )
}