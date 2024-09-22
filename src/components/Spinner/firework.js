import { FPS } from "./constants";

class Firework {
	constructor(q5) {
		this.x = q5.random(q5.width);
		this.y = q5.random(20, q5.height);
		this.r = 1;
		this.exploded = false;
		this.particles = [];
		this.lifespan = 255;
		this.timeStart = q5.millis();
	}

	update(q5) {
		let t = (q5.millis() - this.timeStart) / 1000; // 經過的時間s

		if (t < 0.5) {
			// 上升
			this.y -= 100 / FPS;
			q5.stroke(255);
			q5.strokeWeight(1);
			q5.line(this.x, this.y, this.x, this.y + 30);
		}
		if (t >= 0.5 && t < 3) {
			// 煙火核心
			q5.fill(255);
			q5.noStroke();
			q5.ellipse(this.x, this.y, this.r * 2);
		}

		if (t >= 0.8 && !this.exploded) {
			// 爆炸
			this.explode(q5);
			this.exploded = true;
		}

		// 更新煙花粒子
		for (let i = this.particles.length - 1; i >= 0; i--) {
			this.particles[i].update(q5);
			if (this.particles[i].done()) {
				this.particles.splice(i, 1);
			}
		}
	}

	show(q5) {
		// 顯示煙火的白色圓形或煙花粒子
		if (!this.exploded && q5.millis() - this.timeStart < 1250) {
			q5.fill(255);
			q5.noStroke();
			q5.ellipse(this.x, this.y, this.r * 2);
		}
		for (let p of this.particles) {
			p.show(q5);
		}
	}

	explode(q5) {
		// 爆炸產生粒子
		for (let i = 0; i < 360; i += 10) {
			let angle = q5.radians(i);
			let color = [q5.random(255), q5.random(255), q5.random(255)]; // 隨機顏色
			this.particles.push(
				new Particle(q5, { x: this.x, y: this.y, angle, color }),
			);
		}
	}

	done() {
		// 煙火結束
		return this.exploded && this.particles.length === 0;
	}
}

class Particle {
	constructor(q5, { x, y, angle, color }) {
		this.x = x;
		this.y = y;
		this.v = 100;
		this.angle = angle;
		this.color = color;
		this.length = 2;
		this.lifespan = 255;
		this.acceleration = -30;
		this.timeStart = q5.millis();
	}

	update(q5) {
		let t = (q5.millis() - this.timeStart) / 1000; // 經過的時間（秒）

		// 更新煙花位置
		if (this.v > 0) {
			this.x += (q5.cos(this.angle) * this.v) / FPS;
			this.y += (q5.sin(this.angle) * this.v) / FPS;
			this.v += this.acceleration / FPS;
			this.length += 0.05;
		}

		// 縮短煙花
		if (t > 2.25 && this.length > 2) {
			this.length -= 0.75;
		}

		// 逐漸提高亮度
		if (t > 2.0 && t < 2.5) {
			this.lifespan = q5.min(255, this.lifespan + 20);
		} else if (t >= 2.5) {
			// 逐漸淡出
			this.lifespan -= 80;
		}
	}

	show(q5) {
		// 顯示煙花粒子
		q5.strokeWeight(3);
		q5.stroke(this.color[0], this.color[1], this.color[2], this.lifespan);
		q5.line(
			this.x,
			this.y,
			this.x - q5.cos(this.angle) * this.length,
			this.y - q5.sin(this.angle) * this.length,
		);
	}

	done() {
		return this.lifespan <= 0;
	}
}

export { Firework };
