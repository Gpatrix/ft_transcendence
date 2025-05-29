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
	private moovingInterval: number | undefined = undefined;
	private fixingMoveInterval: number | undefined = undefined;

	constructor(racket: Racket) {
		this.racket = racket;
	}

	public onOpponentHit(ball: Ball, opponentRacket: Racket) {
		const ballCoords = ball.position;
		const hitScaleY = ballCoords.y - opponentRacket.pos.y / opponentRacket.properties.height;
		this.opponentAverageHitY = this.opponentAverageHitY * this.opponentHits + hitScaleY;
		this.opponentHits++;
	}

	public onRoofHit(ball: Ball): void
	{
		const landing = this.calculateBallLanding(ball);
		const estimatedHitY = this.randomizeEstimated(landing[0], landing[1]);
	}

	public onRacketHit(ball: Ball): void
	{
		ball ;
		this.clearIntervals();
	}

	public onStart(, ball: Ball)
	{
		//
	}

	private reseteData(): void
	{
		this.mood = IAMood.NEUTRAL;
		this.clearIntervals();
	}

	public onGoal(ball: Ball): void
	{
		ball;
		this.reseteData();
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

	private calculateBallLanding(ball: Ball): Array<number> {
        const distanceX = mapDimension.x - ball.position.x;

        let landingY = distanceX * (ball.velocity.y / ball.velocity.x) + ball.position.y;
		let colisionCount = 0;
        if (landingY < 0 || landingY > mapDimension.y)
		{
			colisionCount = Math.floor(Math.abs(landingY) / mapDimension.y);
			landingY = landingY % mapDimension.y;
		}
        return ([landingY, colisionCount]);
    }

	private randomizeEstimated(realHitY: number, colisionCount: number, tryCount: number): number
	{
		// const modifiers = this.moodModifiers;
		const random = Math.random();
		const estimationAccuracy = (IA.DEFAULT_ESTIMATION_ACCURACY + IA.DEFAULT_ESTIMATION_ACCURACY * colisionCount * IA.COLISION_ESTIMATION_ACCURACY_MULTIPLIER) / tryCount;
		const b = realHitY - estimationAccuracy / 2;
		const y =   b + random * estimationAccuracy;
		return (y);
	}

	private randomizeDestY(estimatedHitY: number, tryCount: number): number
	{
		// const modifiers = this.moodModifiers;
		tryCount ;
		const isHigher: number = estimatedHitY > this.racket.pos.y ? 1 : 0;
		const random = Math.random();
		const b  = estimatedHitY + (isHigher * this.racket.properties.height) - IA.DEFAULT_ACCURACY;
		return (b + random * IA.DEFAULT_ACCURACY);
	}

	private async goToEstimated(pressedKeysRef: any, whereToStopY: number): Promise<void>
	{
		this.moovingInterval = setInterval(() => {
			if (this.racket.pos.y < whereToStopY)
			{
				if (this.racket.pos.y >= whereToStopY && pressedKeysRef.current.has("BOT_DOWN")) {
                    pressedKeysRef.current.delete("BOT_DOWN");
                }
                if (this.racket.pos.y < whereToStopY && !pressedKeysRef.current.has("BOT_DOWN")) {
                    pressedKeysRef.current.add("BOT_DOWN");
                }
                if (this.racket.pos.y <= whereToStopY && pressedKeysRef.current.has("BOT_UP")) {
                    pressedKeysRef.current.delete("BOT_UP");
                }
                if (this.racket.pos.y > whereToStopY && !pressedKeysRef.current.has("BOT_UP")) {
                    pressedKeysRef.current.add("BOT_UP");
                }
			}
		}, 1);
		return ;
	}

	private async clearIntervals(): Promise<void>
	{
		if (this.fixingMoveInterval !== undefined) {
			clearInterval(this.fixingMoveInterval);
			this.fixingMoveInterval = undefined;
		}
		if (this.moovingInterval !== undefined) {
			clearInterval(this.moovingInterval);
			this.moovingInterval = undefined;
		}
		return ;
	}

	private async moovingLoop(pressedKeysRef: any, ball: Ball): Promise<void>
	{
		let tryCount = 0;
		if (this.fixingMoveInterval !== undefined) {
			clearInterval(this.fixingMoveInterval);
		}
		if (this.moovingInterval !== undefined) {
			clearInterval(this.moovingInterval);
		}
		const whereToStopY = this.randomizeDestY(this.randomizeEstimated(this.calculateBallLanding(ball)[0], this.calculateBallLanding(ball)[1], tryCount), tryCount);

		this.fixingMoveInterval = setInterval(async () => {
			await this.goToEstimated(pressedKeysRef, whereToStopY);
		}, IA.DEFAULT_REACTION_TIME);
		return ;
	}
}

export default IA