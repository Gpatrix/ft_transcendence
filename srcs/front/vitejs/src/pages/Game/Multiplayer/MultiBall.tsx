import { Ball } from "../Local/LocalBall";

interface Props {
    ball: Ball;
}

export default function MultiBallComponent({ ball }: Props) {
    return (
        <div
            className="top-0 absolute bg-yellow rounded-full"
            style={{
                width: ball.radius * 2,
                height: ball.radius * 2,
                transform: `translate(${ball.position.x}px, ${ball.position.y}px)`,
            }}
        />
    );
}
