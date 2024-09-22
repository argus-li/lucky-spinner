import PropTypes from "prop-types";
import clsx from "clsx";

const propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	isDisable: PropTypes.bool,
	onClick: PropTypes.func,
};

const Button = ({ className, children, onClick, isDisable }) => {
	return (
		<button
			className={clsx(
				className,
				"rounded-md border border-white bg-slate-400 py-3 text-center transition-all hover:cursor-pointer hover:border-zinc-200 hover:bg-slate-700 hover:text-zinc-200 active:bg-slate-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-zinc-400 md:mb-0 md:px-16 md:py-4",
			)}
			onClick={onClick}
			disabled={isDisable}
		>
			{children}
		</button>
	);
};

Button.propTypes = propTypes;

export default Button;
