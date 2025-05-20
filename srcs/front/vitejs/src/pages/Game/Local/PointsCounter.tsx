type PointsCounterProps = {
    points : number[]
}

export default function PointsCounter({points} : PointsCounterProps) {    
    return (
        <span className=" w-full flex justify-center text-yellow  absolute font-title top-[10px] gap-16 text-5xl">
            <span className="font-title">{points[1]}</span>
            <span className="font-title">{points[0]}</span>
            <span className="block absolute bg-yellow/50 w-[3px] top-[-10px] h-[500px]"></span>
        </span>
    )
}