import { Racket } from '../pages/Game/Racket';
import { pos, dimension } from "./LocalBall.tsx"
import { mapDimension } from '../pages/Game/Local/LocalGame.tsx';
import { Ball } from '../pages/Game/Local/LocalBall.tsx';

type coef = number;

interface MoodModifiers {
	reactionTime: coef;
	accuracy: coef;
}

const NEUTRAL_MODIFIERS: MoodModifiers = {
	reactionTime: 1.0,
	accuracy: 1.0
}

const ATTACK_MODIFIERS: MoodModifiers = {
	reactionTime: 1.5,
	accuracy: 1.5
}

const DEFEND_MODIFIERS: MoodModifiers = {
	reactionTime: 0.5,
	accuracy: 0.5
}

enum IAMood {
	NEUTRAL,       // neutral
	ATTACK,        // reaction time is a higher, accuracy is high, ia aim to score bit hitting the ball with sides to make impredictable shots
	DEFEND         // reaction time is lower, accuracy is low, ia aim to stop the ball hitting the ball with center
}

enum RacketPart {
	LOWER,
	UPPER
}

class IA {
	static DEFAULT_REACTION_TIME = 200;
	static DEFAULT_ACCURACY = 1.20;      // default plage, it miss is wanted  dest (DEFAULT_ACCURACY - 1)% of the time
	static DEFAULT_ESTIMATION_ACCURACY = 0.20; // default estimated plage, where the bot think the ball will end
	static COLISION_ESTIMATION_ACCURACY_MULTIPLIER = 2; // DEFAULT_ESTIMATION_ACCURACY is multiplied by this every colision on roof
	private opponentAverageHitY: number = 0.5;
	private opponentHits: number = 0;
	private mood: IAMood = IAMood.NEUTRAL;
	private racket: Racket;

	constructor(racket: Racket) {
		this.racket = racket;
	}

	public onOpponentHit(ballCoords: pos, opponentRacket: Racket) {
		const hitScaleY = ballCoords.y - opponentRacket.pos.y / opponentRacket.properties.height;
		this.opponentAverageHitY = this.opponentAverageHitY * this.opponentHits + hitScaleY;
		this.opponentHits++;
	}

	public get opponentFavoriteSide(): RacketPart
	{
		return (this.opponentAverageHitY > 0.5 ? RacketPart.UPPER : RacketPart.LOWER);
	}

	public get opponentAccuracy(): number
	{
		const normalized = this.opponentAverageHitY % 0.5;
		const distance = (0.5 - normalized) * 2;
		return (distance);
	}

	public get moodModifiers(): MoodModifiers {
		switch (this.mood) {
			case IAMood.ATTACK:
				return (ATTACK_MODIFIERS);
			case IAMood.DEFEND:
				return (DEFEND_MODIFIERS);
			default:
				return (NEUTRAL_MODIFIERS);
		}
	}

	private calculateBallLanding(ball: Ball) {
        const distanceX = mapDimension.x - ball.position.x;

        let landingY = distanceX * (ball.velocity.y / ball.velocity.x) + ball.position.y;
        if (landingY < 0 || landingY > mapDimension.y)
            landingY = landingY % mapDimension.y;
        return (landingY);
    }

	private randomizeEstimated(realHitY: number): number
	{
		// const modifiers = this.moodModifiers;
		const random = Math.random();
		const b = realHitY - IA.DEFAULT_ESTIMATION_ACCURACY / 2;
		const y =   b + random * IA.DEFAULT_ESTIMATION_ACCURACY;
		return (y);
	}

	private randomizeDestY(estimatedHitY: number): number
	{
		// const modifiers = this.moodModifiers;
		const isHigher: number = estimatedHitY > this.racket.pos.y ? 1 : 0;
		const random = Math.random();
		const b  = estimatedHitY + (isHigher * this.racket.properties.height) - IA.DEFAULT_ACCURACY;
		return (b + random * IA.DEFAULT_ACCURACY);
	}

	public goToEstimated(currentKeysRef: any, ball: Ball)
	{
		const whereToStopY = this.randomizeDestY(this.randomizeEstimated(this.calculateBallLanding(ball)));
		const loopInterval = setInterval(() => {
			if (this.racket.pos.y < whereToStopY)
			{
				if (!) // implement keyboard here 
			}

		}, 1);
		consts fixPosInterval = setInterval(() => {
				
		}, IA.DEFAULT_REACTION_TIME);
	}





}

export default IA