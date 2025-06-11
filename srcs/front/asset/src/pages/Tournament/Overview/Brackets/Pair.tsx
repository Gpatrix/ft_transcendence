import clsx from "clsx"

interface PairProps {
    top:string,
    bottom:string
    left: boolean
    right: boolean
    distance:number
}

export default function Pair({top, bottom, left, right}: PairProps) {
    return (
        <div className={
            clsx("text-yellow flex flex-col justify-center border-1 \
                  border-yellow w-[150px] px-3 rounded-sm relative"
            ,bottom != null ?  "h-[60px]" : "h-[30px]")}>

            <span className="h-[30px] font-title text-xs overflow-hidden flex items-center">{top ? top : ""}</span>
            {bottom != null && 
                <span className=" h-[30px] font-title overflow-hidden text-xs flex items-center border-t-1">{bottom ? bottom : ""}</span>}
            {right && <span className="absolute right-[-41px] bg-yellow w-[40px] h-[1px]"></span>}
            {left && <span className="absolute left-[-41px] bg-yellow w-[40px] h-[1px]"></span>}
        </div>
    )
}