import { Ball } from "../Local/LocalBall";
import { useEffect, useRef } from "react";

interface Props {
    ball: Ball;
}

export default function BallComponent({ ball }: Props) {
    const ballRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updateBallPosition() {
            if (ballRef.current) {
                ballRef.current.style.transform = `translate(${ball.position.x}px, ${ball.position.y}px)`;
            }
            requestAnimationFrame(updateBallPosition);
        }
        requestAnimationFrame(updateBallPosition);
    }, [ball])

    return (
        <div
            ref={ballRef}
            className="top-0 absolute bg-yellow rounded-full"
            style={{
                width: ball.radius * 2,
                height: ball.radius * 2,
                transform: `translate(${ball.position.x}px, ${ball.position.y}px)`,
            }}
        />
    );
}
