import PropTypes from "prop-types";

const propTypes = {
	children: PropTypes.node,
	isDisable: PropTypes.bool,
	onClick: PropTypes.func,
};

const Button = ({ children, onClick, isDisable }) => {
	return (
		<button
			className="mr-10 rounded-md border border-white bg-slate-400 px-16 py-4 text-center transition-all hover:cursor-pointer hover:border-zinc-200 hover:bg-slate-700 hover:text-zinc-200 active:bg-slate-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-zinc-400"
			onClick={onClick}
			disabled={isDisable}
		>
			{children}
		</button>
	);
};

Button.propTypes = propTypes;

export default Button;
