import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Q5 from "q5";
import { LootCard } from "./loot-card";
import { Firework } from "./firework";
import {
	FPS,
	OneframeTime,
	ActiveNum,
	EmptyCardData,
	CardSize,
} from "./constants";
import { DrawingCardStageEnum, DrawingCardStageList } from "../../utils/enums";

const { DEFAULT, DRAWING, PAUSE, BINGO } = DrawingCardStageEnum;

const Spinner = ({ source, stage, target, onDrawingFinished }) => {
	const sketchRef = useRef(null);
	const canvasRef = useRef(null);
	const stageRef = useRef(stage);
	const targetRef = useRef(target);
	const timerRef = useRef(0);

	useEffect(() => {
		const canvasParent = sketchRef.current;

		const sketch = (q5) => {
			// Loot-card
			let loadedSource = [];
			let cardPools = [];
			let activeCards = [];
			let isReadyToSelected = false;
			let isSelected = false;
			let bounceTime = 0;

			// Firework
			let fireworks = [];

			q5.preload = () => {
				const diff = ActiveNum - source.length;

				// TODO 待優化：非即時顯示圖片的延遲載入
				const loadPromises = source.map((item) =>
					loadImagePromise(item.url).then((img) => ({
						...item,
						img,
					})),
				);

				Promise.all(loadPromises)
					.then((loadedData) => {
						loadedSource = loadedData;
						activeCards = loadedSource.slice(0, ActiveNum);

						if (diff > 0) {
							for (let i = 0; i < diff; i++) {
								activeCards.push(EmptyCardData);
							}
						}
						if (diff < 0) {
							cardPools = loadedSource.slice(ActiveNum);
						}
					})
					.catch((err) => {
						console.error("載入圖片時發生錯誤", err);
					});
			};

			q5.setup = () => {
				const sketchWidth = canvasParent.clientWidth;
				const sketchHeight = canvasParent.clientHeight;
				q5.createCanvas(sketchWidth, sketchHeight);
				q5.frameRate(FPS);

				createCards();
			};

			q5.draw = () => {
				q5.clear();

				switch (stageRef.current) {
					case DEFAULT:
						resetState();
						updateAndDisplayCards(q5, activeCards, {
							v: 2,
							acc: 0,
						});
						break;
					case PAUSE:
						updateAndDisplayCards(q5, activeCards, {
							v: 0,
							acc: 0,
						});
						break;
					case DRAWING:
						handleDrawingPhase(q5, activeCards, targetRef.current);

						if (isSelected) {
							onDrawingFinished();
						}

						break;
					case BINGO:
						updateAndDisplayCards(q5, activeCards, {
							v: 0,
							acc: 0,
						});
						releaseFireworks();
						break;
					default:
						break;
				}

				recycleCard(q5, activeCards, cardPools);
				drawFirework(q5, fireworks);
				timerRef.current += OneframeTime;
			};

			q5.windowResized = () => {
				q5.resizeCanvas(
					canvasParent.clientWidth,
					canvasParent.clientHeight,
				);
			};

			function loadImagePromise(path) {
				return new Promise((resolve, reject) => {
					q5.loadImage(
						path,
						(img) => resolve(img), // 圖片載入成功
						(err) => reject(err), // 圖片載入失敗
					);
				});
			}

			function createCards() {
				activeCards = activeCards.map((cardData, i) => {
					const card = new LootCard(cardData);
					card.init(q5, {
						x:
							q5.width -
							(CardSize.width * (i + 1) + CardSize.marginL * i),
						v: 2,
						acc: 0,
					});
					return card;
				});

				cardPools = cardPools.map((cardData) => new LootCard(cardData));
			}

			function updateAndDisplayCards(q5, cards, { v, acc }) {
				cards.forEach((card) => {
					card.update(q5, { v, acc });
					card.display(q5);
				});
			}

			function handleDrawingPhase(q5, cards, target) {
				cards.forEach((card) => {
					card.drawingUpdate(q5, {
						isReadyToSelected,
						bounceTime,
						v: 2,
						acc: 0.5,
						t: timerRef.current,
					});
					card.display(q5);

					if (card.id === target) {
						if (!isReadyToSelected) {
							isReadyToSelected = card.isReadyToSelected(q5, {
								t: timerRef.current,
							});
							if (isReadyToSelected) {
								timerRef.current = 0;
								bounceTime = card.calculateBounceTime(q5);
							}
						}
						if (!isSelected && isReadyToSelected) {
							isSelected = card.v === 0;
						}
					}
				});
			}

			function recycleCard(q5, activeCards, cardPools) {
				if (activeCards[0].isInactive(q5)) {
					restoreCard(activeCards.shift(), cardPools);
					regainCard(cardPools.shift(), activeCards);
				}
			}

			function regainCard(card, activeCards) {
				const lastCard = activeCards[activeCards.length - 1];

				card.init(q5, {
					x: lastCard.x - (CardSize.width + CardSize.marginL),
					v: lastCard.v,
					acc: lastCard.acc,
				});
				activeCards.push(card);
			}

			function restoreCard(card, cardPools) {
				cardPools.push(card);
			}

			function resetState() {
				isReadyToSelected = false;
				isSelected = false;
				bounceTime = 0;
			}

			function releaseFireworks() {
				// 隨機放煙火
				const canFire =
					q5.frameCount % (FPS / 3) === 0 && q5.random(4) > 1;

				if (canFire) {
					fireworks.push(new Firework(q5));
				}
			}

			function drawFirework(q5, fireworks) {
				for (let i = fireworks.length - 1; i >= 0; i--) {
					fireworks[i].update(q5);
					fireworks[i].show(q5);

					if (fireworks[i].done()) {
						fireworks.splice(i, 1);
					}
				}
			}
		};

		canvasRef.current = new Q5(sketch, canvasParent);
		return () => canvasRef.current.remove();
	}, []);

	useEffect(() => {
		stageRef.current = stage;

		if (stage === DRAWING) {
			timerRef.current = 0;
		}
	}, [stage]);

	useEffect(() => {
		targetRef.current = target;
	}, [target]);

	return <div ref={sketchRef} className="min-h-[40vh]" />;
};

Spinner.propTypes = {
	stage: PropTypes.oneOf(DrawingCardStageList),
	source: PropTypes.array,
	target: PropTypes.string,
	onDrawingFinished: PropTypes.func,
};

export default Spinner;
