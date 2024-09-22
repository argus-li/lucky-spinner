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
		<div className="h-dvh overflow-hidden bg-black pt-20">
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
				<section className="m-10 flex gap-10">
					<select
						className="rounded-md bg-emerald-800 px-16 py-4 text-center transition-all hover:cursor-pointer hover:border-zinc-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-zinc-400"
						disabled={[DRAWING, BINGO].includes(drawingCardStage)}
						value={selectedCard}
						onChange={(e) => setSelectedCard(e.target.value)}
					>
						{DemoData.map(({ id, name }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</select>
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
					<Button
						isDisable={drawingCardStage === DRAWING}
						className="ml-auto"
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
				</section>
			</main>
		</div>
	);
};

export default App;
