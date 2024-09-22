// 緩動函數
function easeOutElastic(x) {
	const c4 = (2 * Math.PI) / 3;
	return x === 0
		? 0
		: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeOutCirc(x) {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeInCirc(x) {
	return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export { easeOutElastic, easeOutCirc, easeInCirc };
