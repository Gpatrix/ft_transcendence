import { Racket } from '../pages/Game/Racket';
import { Ball } from '../pages/Game/Local/LocalBall.tsx';

interface dimension {
    x: number,
    y: number
}

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

export class IA {
	private racket: Racket;
	private ball: Ball;

	static DEFAULT_REACTION_TIME = 200;
	static DEFAULT_ACCURACY = 1.20;      // default plage, it miss is wanted  dest (DEFAULT_ACCURACY - 1)% of the time
	static DEFAULT_ESTIMATION_ACCURACY = 0.20; // default estimated plage, where the bot think the ball will end
	static COLISION_ESTIMATION_ACCURACY_MULTIPLIER = 2; // DEFAULT_ESTIMATION_ACCURACY is multiplied by this every colision on roof
	private opponentAverageHitY: number = 0.5;
	private opponentHits: number = 0;
	private mood: IAMood = IAMood.NEUTRAL;
	private movingTimeout: number | undefined = undefined;
	private fixingMoveInterval: number | undefined = undefined;
	private estimatedHitY: number = 0;
	private pressedKeys: Set<string>;            // to access value call this.pressedKeys.current because it is a ref
	private readonly mapDimension: dimension;

	constructor(racket: Racket, ball: Ball, pressedKeys: Set<string>, mapDimension: mapDimension = dimension) {
		this.racket = racket;
		this.ball = ball;
		this.pressedKeys = pressedKeys;
		this.mapDimension = mapDimension;
	}

	public onOpponentHit(opponentRacket: Racket) {
		const ballCoords = this.ball.position;
		const hitScaleY = ballCoords.y - opponentRacket.pos.y / opponentRacket.properties.height;
		this.opponentAverageHitY = this.opponentAverageHitY * this.opponentHits + hitScaleY;
		this.opponentHits++;
		this.tryToInterceptShot();
	}

	public onRacketHit(): void
	{
		this.clearIntervals();
	}

	public onBallLaunch()
	{
		this.tryToInterceptShot();
	}

	private reseteData(): void
	{
		this.mood = IAMood.NEUTRAL;
		this.clearIntervals();
	}

	public onGoal(): void
	{
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
		return (Math.abs(distance));
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

	private calculateBallLanding(ball: Ball): Array<number> | undefined {
        const distanceX = this.mapDimension.x - ball.position.x;

		if (ball.velocity.x === 0)
			return (undefined);

        let landingY = distanceX * (ball.velocity.y / ball.velocity.x) + ball.position.y;
		let colisionCount = 0;
        if (landingY < 0 || landingY > this.mapDimension.y)
		{
			colisionCount = Math.floor(Math.abs(landingY) / this.mapDimension.y);
			landingY = Math.abs(landingY % this.mapDimension.y);
		}
        return ([landingY, colisionCount]);
    }

	private randomizeEstimated(realHitY: number, colisionCount: number, tryCount: number): number
	{
		// const modifiers = this.moodModifiers;
		const random = Math.random();
		const estimationAccuracy = this.moodModifiers.accuracy * IA.DEFAULT_ACCURACY;
		// const estimationAccuracy = (IA.DEFAULT_ESTIMATION_ACCURACY + IA.DEFAULT_ESTIMATION_ACCURACY * colisionCount * IA.COLISION_ESTIMATION_ACCURACY_MULTIPLIER) / tryCount;
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

	private async goToEstimated(whereToStopY: number): Promise<void>
	{
		// console.log('distance to go:', Math.abs(whereToStopY - this.racket.pos.y));
		// console.log('speed:', this.racket.properties.speed);
		const timeToGo = Math.abs(whereToStopY - this.racket.pos.y) / (this.racket.properties.speed / 1000); // in seconds;
		// TODO time to go is broken it refers to a time but we have to refer to a tick
		// console.log(`IA: going to estimated Y: ${whereToStopY} in ${timeToGo}ms`);
		if (whereToStopY > this.racket.pos.y + this.racket.properties.height / 2)
			this.pressedKeys.add("BOT_DOWN");
		else if (whereToStopY < this.racket.pos.y - this.racket.properties.height / 2)
			this.pressedKeys.add("BOT_UP");

		await new Promise<void>(resolve => {
			this.movingTimeout = setTimeout(() => {
				this.pressedKeys.delete("BOT_UP");
				this.pressedKeys.delete("BOT_DOWN");
				resolve();
			}, timeToGo);
		})
	}

	private async clearIntervals(): Promise<void>
	{
		if (this.fixingMoveInterval !== undefined) {
			clearInterval(this.fixingMoveInterval);
			this.fixingMoveInterval = undefined;
		}
		if (this.movingTimeout !== undefined) {
			clearInterval(this.movingTimeout);
			this.movingTimeout = undefined;
		}
		return ;
	}

	private async tryToInterceptShot(): Promise<void>
	{
		let tryCount = 0;
		if (this.fixingMoveInterval !== undefined) {
			clearInterval(this.fixingMoveInterval);
		}
		if (this.movingTimeout !== undefined) {
			clearInterval(this.movingTimeout);
		}
		const calculatedBallLanding: Array<number> | undefined = this.calculateBallLanding(this.ball);
		if (calculatedBallLanding === undefined) {
			return ;
		}

		this.estimatedHitY = this.randomizeEstimated(calculatedBallLanding[0], calculatedBallLanding[1], tryCount);
		const whereToStopY: number | undefined = this.randomizeDestY(this.estimatedHitY, tryCount);
		await this.goToEstimated(whereToStopY);


		// this.fixingMoveInterval = setInterval(async () => {
		// 	tryCount++;
		// }, IA.DEFAULT_REACTION_TIME);
		return ;
	}
}

export default IA