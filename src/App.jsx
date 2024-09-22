import { useState, useCallback } from "react";
import Spinner from "./components/Spinner";
import Button from "./components/Button";
import { DrawingCardStageEnum } from "./utils/enums";
import { DemoData } from "./demo";

const { DEFAULT, DRAWING, PAUSE, BINGO } = DrawingCardStageEnum;

const App = () => {
	const [drawingCardStage, setDrawingCardStage] = useState(DEFAULT);
	const [selectedCard, setSelectedCard] = useState(DemoData[0].id);
	const handleDrawingFinished = useCallback(
		() => setDrawingCardStage(BINGO),
		[],
	);

	return (
		<div className="h-dvh overflow-hidden bg-slate-950 pt-20">
			<header className="mb-10 text-center text-3xl font-bold text-slate-100">
				幸運抽獎 🎉
			</header>
			<main>
				<Spinner
					source={DemoData}
					stage={drawingCardStage}
					target={selectedCard}
					onDrawingFinished={handleDrawingFinished}
				/>
				<section className="m-10">
					<Button
						isDisable={drawingCardStage === DRAWING}
						onClick={() =>
							setDrawingCardStage((stage) =>
								[PAUSE, BINGO].includes(stage)
									? DEFAULT
									: PAUSE,
							)
						}
					>
						{[PAUSE, BINGO].includes(drawingCardStage)
							? "繼 續"
							: "暫 停"}
					</Button>
					<Button
						isDisable={drawingCardStage === DRAWING}
						onClick={() => {
							setDrawingCardStage((stage) =>
								stage === BINGO ? DEFAULT : DRAWING,
							);
						}}
					>
						{drawingCardStage === BINGO ? "重 置" : "抽 卡"}
					</Button>
					<select
						disabled={drawingCardStage === DRAWING}
						value={selectedCard}
						onChange={(e) => setSelectedCard(e.target.value)}
					>
						{DemoData.map(({ id, name }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</select>
				</section>
			</main>
		</div>
	);
};

export default App;
