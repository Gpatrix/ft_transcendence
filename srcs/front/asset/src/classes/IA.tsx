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

class IA {
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

	constructor(racket: Racket, pressedKeys: Set<string>, mapDimension: dimension)
	{
		this.racket = racket;
		this.pressedKeys = pressedKeys;
		this.mapDimension = mapDimension;
	}

	public refreshView(opponentRacket: Racket, ball: Ball)
	{
        this.tryToInterceptShot(JSON.parse(JSON.stringify(ball)), opponentRacket);
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

	private calculateBallLanding(ball: Ball, racketPos: pos, pos?: pos, velocity?: pos): Array<number> | undefined
	{
		const ballPos = pos || ball.position;
		const ballVelocity = velocity || ball.velocity;
		let distanceX = Math.abs(ballPos.x - racketPos.x);
		let landingY = distanceX * (ballVelocity.y / ballVelocity.x) + ballPos.y;
		let bouceCount = 0;

		while (landingY < 0 || landingY > (this.mapDimension.y)) {
			if (landingY < 0) {
				landingY = -landingY;
			} else if (landingY > (this.mapDimension.y)) {
				landingY = 2 * (this.mapDimension.y) - landingY;
			}
			bouceCount++;
		}
		return ([landingY, bouceCount]);
	}

	private calculateBallShooting(ball: Ball, opponentRacket: Racket): Array<number> | undefined {
		const ballLanding = this.calculateBallLanding(ball, opponentRacket.pos);
		if (!ballLanding) return;
	
		const ballLandingY = ballLanding[0];
		const racketCenterY = opponentRacket.pos.y + opponentRacket.properties.height / 2;
	
		// Simuler l'impact
		if (ballLandingY >= opponentRacket.pos.y && ballLandingY <= opponentRacket.pos.y + opponentRacket.properties.height) {
			const relativeImpactY = (ballLandingY + ball.radius - racketCenterY) / (opponentRacket.properties.height / 2);
	
			const predictedVelocityX = -ball.velocity.x * 1.05;
			const predictedVelocityY = relativeImpactY * 300 - ball.velocity.y * 0.2;
	
			const homeLanding = this.calculateBallLanding(ball, this.racket.pos, opponentRacket.pos, { x: predictedVelocityX, y: predictedVelocityY });
	
			if (!homeLanding) return;
			return [homeLanding[0], homeLanding[1]];
		}
		return undefined;
	}

	private randomizeEstimated(realHitY: number, tryCount: number): number
	{
		let racketsCoordsAiming: number = 0;
		if (tryCount > 0) {
			if (realHitY < this.racket.pos.y + this.racket.properties.height / 2)
				racketsCoordsAiming = (this.racket.properties.height / 4); // /4
			else
				racketsCoordsAiming = -(this.racket.properties.height / 4); // /4
		}

		const noise = Math.floor(Math.min(Math.max(-300, ((Math.random() - 0.5) * (IA.DEFAULT_ACCURACY * this.racket.properties.height))), 300));
		const y = realHitY + (noise != Infinity ? noise : 0) + racketsCoordsAiming;
		return (y);
	}

	private async goToEstimated(whereToStopY: number): Promise<void>
	{
        const racketCenter: number = this.racket.pos.y + (this.racket.properties.height / 2);

        const distance =  Math.abs(whereToStopY - racketCenter);

		const timeToGo = distance / (this.racket.properties.speed / 1000); // in seconds;
		if (whereToStopY > racketCenter)
			this.pressedKeys.add("BOT_DOWN");
		else
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

    private async interceptBall(estimated: number, tryCount: number) : Promise<void>
    {
        this.estimatedHitY = this.randomizeEstimated(estimated, tryCount);
        await this.goToEstimated(this.estimatedHitY);
    }

	private async tryToInterceptShot(ball: Ball, opponentRacket: Racket): Promise<void>
	{
		let tryCount = 0;
		let temp: Array<number> | undefined = undefined;
		
        this.clearIntervals();

		let calculatedBallLanding: Array<number> | undefined = undefined;
		let calculatedBallShooting: Array<number> | undefined = undefined;
		let oppositeBallLanding: Array<number> | undefined = undefined;
		if (ball.velocity.x >= 0)
			calculatedBallLanding = this.calculateBallLanding(ball, this.racket.pos);
		else
		{
			temp = this.calculateBallShooting(ball, opponentRacket);
			if (temp != undefined)
				calculatedBallShooting = temp;
			else
				oppositeBallLanding = [opponentRacket.pos.y + opponentRacket.properties.height / 2, 0];
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

        // this.interceptBall(estimated, tryCount);
		this.fixingMoveInterval = setInterval(async () =>
		{
            this.interceptBall(estimated, tryCount);
            tryCount++;
		}, ((Math.random() - 0.50) * IA.DEFAULT_ADJUST_INTERVAL_RANGE) + IA.DEFAULT_ADJUST_INTERVAL);
		return ;
	}
}

export default IA