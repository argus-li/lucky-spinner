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
		<div className="h-dvh overflow-hidden bg-black pt-8 md:pt-20">
			<header className="mb-4 text-center text-3xl font-bold text-slate-100 md:mb-10">
				幸運抽獎 🎉
			</header>
			<main>
				<Spinner
					source={DemoData}
					stage={drawingCardStage}
					target={selectedCard}
					onDrawingFinished={handleDrawingFinished}
				/>
				<section className="m-6 flex flex-col gap-4 md:m-10 md:flex-row md:gap-10">
					<select
						className="rounded-md bg-emerald-800 py-4 text-center transition-all hover:cursor-pointer hover:border-zinc-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-zinc-400 md:px-16 md:py-2"
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
					{[PAUSE, DEFAULT].includes(drawingCardStage) && (
						<Button
							isDisable={drawingCardStage === DRAWING}
							className="md:ml-auto md:mt-0"
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
					)}
				</section>
			</main>
		</div>
	);
};

export default App;
