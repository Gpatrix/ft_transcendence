import { ReactNode } from "react"
import Wall from "../Wall"
import HitBox from "../HitBox"
import RacketComponent from "../Racket"

export default function ThreePlayers() {
    return (
    <div className="relative w-[500px] h-[500px]">
        <HitBox players={3}>
            <RacketComponent 
                id={1}
                left={50}
                angle={0}
                bottom={-3.5}           
            />
            <RacketComponent 
                id={2}
                right={4}  
                angle={180+60}
                bottom={0}           
            />
            <RacketComponent 
                id={3}
                left={11}  
                angle={-60}
                bottom={10.5}           
            />
        </HitBox>
        <Wall left={25} bottom={-7} angle={-60}/>
        <Wall left={75} bottom={-7} angle={60}/>
        <Wall left={50} bottom={-50} angle={0}/>    
    </div>
    )
}