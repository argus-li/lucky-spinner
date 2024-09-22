const FPS = 60;
const OneframeTime = 1 / FPS;
const ActiveNum = 15;

const CardSize = {
	width: 240,
	height: 200,
	marginL: 20,
};

const FadeRate = 1;
const SpeedUpLimit = 80;
const SpeedDownLimit = 20;
const EaseTime = 3;
const PeakTime = EaseTime + 1;
const EmptyCardData = {
	id: -1,
	name: "(空)",
	url: "",
};

export {
	FPS,
	OneframeTime,
	ActiveNum,
	CardSize,
	FadeRate,
	SpeedUpLimit,
	SpeedDownLimit,
	EaseTime,
	PeakTime,
	EmptyCardData,
};
