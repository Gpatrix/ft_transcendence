import { Racket } from '../pages/Game/Racket';
import { Ball } from '../pages/Game/Local/LocalBall.tsx';

interface dimension {
    x: number,
    y: number
}

enum RacketPart {
	LOWER,
	UPPER
}

export class IA {
	private racket: Racket;

	static DEFAULT_REACTION_TIME = 200;
	static DEFAULT_ACCURACY = 1.20;      // default plage, it miss is wanted  dest (DEFAULT_ACCURACY - 1)% of the time
	static DEFAULT_ESTIMATION_ACCURACY = 0.20; // default estimated plage, where the bot think the ball will end
	static COLISION_ESTIMATION_ACCURACY_MULTIPLIER = 2; // DEFAULT_ESTIMATION_ACCURACY is multiplied by this every colision on roof
	private opponentAverageHitY: number = 0.5;
	private opponentHits: number = 0;
	private movingTimeout: number | undefined = undefined;
	private fixingMoveInterval: number | undefined = undefined;
	private estimatedHitY: number = 0;
	private pressedKeys: Set<string>;            // to access value call this.pressedKeys.current because it is a ref
	private readonly mapDimension: dimension;

	constructor(racket: Racket, pressedKeys: Set<string>, mapDimension: dimension) {
		this.racket = racket;
		this.pressedKeys = pressedKeys;
		this.mapDimension = mapDimension;
	}

	public refreshView(opponentRacket: Racket, ball: Ball) {
		// const ballCoords = ball.position;
		// const hitScaleY = ballCoords.y - opponentRacket.pos.y / opponentRacket.properties.height;
		// this.opponentAverageHitY = this.opponentAverageHitY * this.opponentHits + hitScaleY;
		// this.opponentHits++;
		this.tryToInterceptShot(ball);
	}

	public onRacketHit(): void
	{
		this.clearIntervals();
	}

	private reseteData(): void
	{
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

	private calculateBallLanding(ball: Ball): Array<number> | undefined {
		const distanceX = this.mapDimension.x - ball.position.x;
		let landingY = distanceX * (ball.velocity.y / ball.velocity.x) + ball.position.y;
		let bouceCount = 0;

		while (landingY < 0 || landingY > this.mapDimension.y) {
			if (landingY < 0) {
				landingY = -landingY;
			} else if (landingY > this.mapDimension.y) {
				landingY = 2 * this.mapDimension.y - landingY;
			}
			bouceCount++;
		}

		console.log('landingY:', landingY, 'bouceCount:', bouceCount);

		return ([landingY, bouceCount]);
	}

	private randomizeEstimated(realHitY: number, colisionCount: number): number
	{
		let racketsCoordsAiming: number = 0;
		if (realHitY > this.racket.pos.y + this.racket.properties.height / 2)
			racketsCoordsAiming = this.racket.properties.height / 4;
		else if (realHitY < this.racket.pos.y - this.racket.properties.height / 2)
			racketsCoordsAiming = -this.racket.properties.height / 4;
		const random = Math.random();
		const b = realHitY - IA.DEFAULT_ACCURACY / 2 + racketsCoordsAiming;
		const y =   b + random * IA.DEFAULT_ACCURACY  - this.racket.properties.height / 2;
		return (y);
	}

	private randomizeDestY(estimatedHitY: number): number
	{
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

	private async tryToInterceptShot(ball: Ball): Promise<void>
	{
		if (this.fixingMoveInterval !== undefined) {
			clearInterval(this.fixingMoveInterval);
		}
		if (this.movingTimeout !== undefined) {
			clearInterval(this.movingTimeout);
		}
		const calculatedBallLanding: Array<number> | undefined = this.calculateBallLanding(ball);
		if (calculatedBallLanding === undefined) {
			return ;
		}

		console.log(calculatedBallLanding)

		this.fixingMoveInterval = setInterval(async () => {
			this.estimatedHitY = this.randomizeEstimated(calculatedBallLanding[0], calculatedBallLanding[1]);
			const whereToStopY: number | undefined = this.randomizeDestY(this.estimatedHitY);
			await this.goToEstimated(whereToStopY);		
		}, Math.random() * IA.DEFAULT_REACTION_TIME);
		return ;
	}
}

export default IA