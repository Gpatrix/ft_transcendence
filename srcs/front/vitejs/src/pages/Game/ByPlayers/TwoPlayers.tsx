import BallComponent from "../Ball/Ball";
import HitBox from "../HitBox";
import RacketComponent from "../Racket";
import Wall from "../Wall";

export default function TwoPlayers() {
    const width = 500
    const height = 300
    return (
        <span className="block relative" style={{
            width: `${width}px`,
            height: `${height}px`,
          }}>
            <HitBox players={2}>
                <RacketComponent bottom={5} id={1} left={2}/>
                <RacketComponent bottom={5} id={2} right={2}/>
            </HitBox>
            <Wall id={"left"} height={height} bottom={0} />
            <Wall id={"right"} height={height} bottom={0} right={0} />
            <Wall id={"bottom"} height={width} angle={0} left={50} top={15}/>
            <Wall id={"top"} height={width} angle={0} left={50} bottom={16}/>
            <BallComponent />
        </span>
    )
}