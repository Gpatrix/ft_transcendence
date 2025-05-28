import clsx from "clsx"

interface PairProps {
    top:string,
    bottom:string
}

export default function Pair({top, bottom}: PairProps) {
    return (
        <div className={
            clsx("text-yellow flex flex-col justify-center border-1 \
                  border-yellow w-[150px] px-3 rounded-sm overflow-hidden"
            ,bottom != null ?  "h-[60px]" : "h-[30px]")}>
            <span className="h-[30px]">{top ? top : ""}</span>
            {bottom != null && <span className=" h-[30px]  border-t-1">{bottom ? bottom : ""}</span>}
        </div>
    )
}