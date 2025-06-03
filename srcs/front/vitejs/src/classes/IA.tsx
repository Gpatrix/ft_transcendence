import { Racket } from '../pages/Game/Racket';
import { Ball, pos } from '../pages/Game/Local/LocalBall.tsx';

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

	static readonly DEFAULT_ADJUST_INTERVAL = 100;
	static readonly DEFAULT_ADJUST_INTERVAL_RANGE = 0.50;
	static readonly DEFAULT_ACCURACY = 0.001;      // default plage, it miss is wanted  dest (DEFAULT_ACCURACY - 1)% of the time
	private opponentAverageHitY: number = 0.5;
	// private opponentHits: number = 0;
	private movingTimeout: number | undefined = undefined;
	private fixingMoveInterval: number | undefined = undefined;
	private estimatedHitY: number = 0;
	private pressedKeys: Set<string>;            // to access value call this.pressedKeys.current because it is a ref
	private readonly mapDimension: dimension;
	private lastBall: Ball | undefined = undefined;

	constructor(racket: Racket, pressedKeys: Set<string>, mapDimension: dimension) {
		this.racket = racket;
		this.pressedKeys = pressedKeys;
		this.mapDimension = mapDimension;
	}

	public refreshView(opponentRacket: Racket, ball: Ball) {
		// if (this.lastBall && this.lastBall.velocity.x != ball.velocity.x && this.lastBall.velocity.y != ball.velocity.y) {
		// 	opponentHits++;
		// }
		this.lastBall = JSON.parse(JSON.stringify(ball));
		this.tryToInterceptShot(ball, opponentRacket);
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

	private calculateBallLanding(ball: Ball, racketPos: pos, pos?: pos, velocity?: pos): Array<number> | undefined {
		const ballPos = pos || ball.position;
		const ballVelocity = velocity || ball.velocity;
		let distanceX = Math.abs(ballPos.x - racketPos.x);
		let landingY = distanceX * (ballVelocity.y / ballVelocity.x) + ballPos.y;
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

	private calculateBallShooting(ball: Ball, oponnentRacket: Racket): Array<number> | undefined {
		const ballLandingResult = this.calculateBallLanding(ball, oponnentRacket.pos);
		if (ballLandingResult === undefined) {
			return undefined;
		}
		const ballLandingY = ballLandingResult[0];

		// if (playerRacket will catch the shot)
		if (ballLandingY <= oponnentRacket.pos.y + oponnentRacket.properties.height &&
			ballLandingY >= oponnentRacket.pos.y) {
			const racketHitY = ballLandingY - oponnentRacket.pos.y;
			const racketHalfHeight = oponnentRacket.properties.height / 2;
			const relativeImpactY = (racketHitY + ball.radius - oponnentRacket.pos.y + racketHalfHeight) / racketHalfHeight;
			const homeBalLanding = this.calculateBallLanding(ball, this.racket.pos, { x: oponnentRacket.pos.x, y: ballLandingY }, { x: -(ball.velocity.x), y: relativeImpactY});
			console.log('IA see the player will hit at Y:', ballLandingY, 'relativeImpactY:', relativeImpactY);
			if (homeBalLanding === undefined)
				return (undefined);
			return ([homeBalLanding[0], homeBalLanding[1]]);
		}
		return (undefined)
		
	}

	private randomizeEstimated(realHitY: number, tryCount: number): number
	{
		let racketsCoordsAiming: number = 0;
		if (tryCount > 0) {
			if (realHitY > this.racket.pos.y + this.racket.properties.height / 2)
				racketsCoordsAiming = (this.racket.properties.height / 4); // /4
			else if (realHitY < this.racket.pos.y)
				racketsCoordsAiming = -(this.racket.properties.height / 4); // /4
		}

		const noise = Math.floor(Math.min(Math.max(-300, ((Math.random() - 0.5) * (IA.DEFAULT_ACCURACY * this.racket.properties.height))), 300));
		const y = realHitY + (noise != Infinity ? noise : 0) + racketsCoordsAiming;
		return (y);
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

	private async tryToInterceptShot(ball: Ball, opponentRacket: Racket): Promise<void>
	{
		let tryCount = 0;
		let temp: Array<number> | undefined = undefined;
		if (this.fixingMoveInterval !== undefined) {
			clearInterval(this.fixingMoveInterval);
		}
		if (this.movingTimeout !== undefined) {
			clearInterval(this.movingTimeout);
		}

		let calculatedBallLanding: Array<number> | undefined = undefined;
		let calculatedBallShooting: Array<number> | undefined = undefined;
		let oppositeBallLanding: Array<number> | undefined = undefined;
		if (ball.velocity.x >= 0) {
			calculatedBallLanding = this.calculateBallLanding(ball, this.racket.pos);
			console.log('IA see the ball will land at Y:', calculatedBallLanding?.[0]);
		}
		else
		{
			temp = this.calculateBallShooting(ball, opponentRacket);
			if (temp != undefined) {
				calculatedBallShooting = temp;
				console.log('IA see the ball will shoot at Y:', calculatedBallShooting?.[0]);
			}
			else
			{
				oppositeBallLanding = [opponentRacket.pos.y + opponentRacket.properties.height / 2, 0];
			}				
		}
		let goToEstimatedMutex = false;
		this.fixingMoveInterval = setInterval(async () => {
			if (!goToEstimatedMutex) {
				if (ball.velocity.x <= 0) {
					temp = this.calculateBallShooting(ball, opponentRacket);
					if (temp != undefined) {
						calculatedBallShooting = temp;
						console.log('IA see the ball will shoot at Y:', calculatedBallShooting?.[0]);
					}
					else
					{
						oppositeBallLanding = [opponentRacket.pos.y + opponentRacket.properties.height / 2, 0];
					}				
				}
				let estimated: number | undefined = undefined;
				if (calculatedBallLanding != undefined)
					estimated = calculatedBallLanding[0];
				else if (calculatedBallShooting != undefined)
					estimated = calculatedBallShooting[0];
				else if (oppositeBallLanding !== undefined)
					estimated = oppositeBallLanding[0];
				else
					return ;
				this.estimatedHitY = this.randomizeEstimated(estimated, tryCount);
				goToEstimatedMutex = true ;
				await this.goToEstimated(this.estimatedHitY);
				goToEstimatedMutex = false;
				tryCount++;
			}
		}, ((Math.random() - 0.50) * IA.DEFAULT_ADJUST_INTERVAL_RANGE) + IA.DEFAULT_ADJUST_INTERVAL);
		return ;
	}
}

export default IA