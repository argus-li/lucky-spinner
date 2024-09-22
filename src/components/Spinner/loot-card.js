import { easeOutElastic, easeOutCirc, easeInCirc } from "../../utils/easing";
import {
	FPS,
	CardSize,
	FadeRate,
	SpeedUpLimit,
	SpeedDownLimit,
	EaseTime,
	PeakTime,
} from "./constants";

/**
 * (x, y): 卡片最左上角原點（不含marginL）
 * marginL: 卡片左邊外側空間
 */
class LootCard {
	constructor({ id, name, url, img }) {
		this.id = id;
		this.name = name;
		this.url = url;
		this.img = img;
	}

	init(q5, { x, v, acc }) {
		this.x = x;
		this.y = q5.height / 2 - CardSize.height / 2; // 置中
		this.v = v;
		this.acc = acc;
		this.alpha = 0;
	}

	update(q5, { v, acc }) {
		this.v = v;
		this.acc = acc;
		this.calculateX(this.v);
		this.calculateOpacity(q5);
	}

	calculateX(dx) {
		this.x += dx;
	}

	calculateOpacity(q5) {
		const rightX = this.x + CardSize.width;
		if (rightX < CardSize.width) {
			this.fadeIn(q5, rightX);
		} else if (rightX > q5.width) {
			this.fadeOut(q5, rightX - q5.width);
		} else {
			this.alpha = 255;
		}
	}

	fadeIn(q5, x) {
		this.alpha = q5.map(x, 0, CardSize.width, 0, 255) * FadeRate;
	}

	fadeOut(q5, x) {
		this.alpha = q5.map(x, 0, CardSize.width, 255, 0) * FadeRate;
	}

	display(q5) {
		q5.noStroke();
		q5.fill(255, this.alpha);
		q5.rect(this.x, this.y, CardSize.width, CardSize.height);

		this.drawBackgroundRect(q5);
		this.drawImage(q5);
		this.drawText(q5);
	}

	drawBackgroundRect(q5) {
		const squareColor = q5.color(192, 192, 192, this.alpha);

		q5.push();
		q5.rectMode(q5.CENTER);
		q5.fill(squareColor);
		q5.rect(this.x + 120, this.y + 80, 220, 140);
		q5.pop();
	}

	drawImage(q5) {
		if (!this.img) return;

		q5.push();
		q5.imageMode(q5.CENTER);
		q5.image(this.img, this.x + 120, this.y + 80, 100, 100);
		q5.pop();
	}

	drawText(q5) {
		q5.push();
		q5.fill(q5.color(0, 100, 0, this.alpha));
		q5.textFont("PingFang SC");
		q5.textSize(18);
		q5.textAlign(q5.CENTER);
		q5.text(`${this.name}`, this.x + 120, this.y + 182);
		q5.pop();
	}

	drawingUpdate(q5, { isReadyToSelected, bounceTime, acc, t, v }) {
		this.v = v;
		this.acc = acc;

		if (isReadyToSelected) {
			this.calculateBounceX(t, bounceTime);
		} else if (t > PeakTime) {
			this.calculateSpeedDownX(t - PeakTime);
		} else {
			this.calculateSpeedUpX(t);
		}

		this.calculateOpacity(q5);
	}

	calculateSpeedUpX(t) {
		const v0 = this.v;
		const vFinal = SpeedUpLimit;
		const T = EaseTime;

		const dx = t >= T ? vFinal : v0 + (vFinal - v0) * easeInCirc(t / T);
		this.calculateX(dx);
	}

	calculateSpeedDownX(t) {
		const v0 = SpeedUpLimit;
		const vFinal = SpeedDownLimit;
		const T = EaseTime;

		const dx = t >= T ? vFinal : v0 + (vFinal - v0) * easeOutCirc(t / T);
		this.calculateX(dx);
	}

	calculateBounceX(t, bounceTime) {
		const v0 = SpeedDownLimit;
		const T = bounceTime;

		const dx = t >= T ? 0 : v0 * easeOutElastic(t / T);
		this.calculateX(dx);

		if (t >= T) this.v = 0;
	}

	isReadyToSelected(q5, { t }) {
		const T = EaseTime + PeakTime;
		if (t < T) return false;

		const centralCardX = q5.width / 2 - CardSize.width / 2;
		const trigerX = centralCardX - CardSize.width;
		const closeDiff = this.x - trigerX;

		return closeDiff >= 0 && closeDiff < SpeedDownLimit * 2;
	}

	calculateBounceTime(q5) {
		const centralCardX = q5.width / 2 - CardSize.width / 2;
		return (centralCardX - this.x) / SpeedDownLimit / FPS;
	}

	isInactive(q5) {
		return this.x > q5.width + CardSize.width;
	}
}

export { LootCard };
