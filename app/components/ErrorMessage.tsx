import { Component } from "../types";

interface Props {
	children: Component
}

export default function ErrorMessage( { children }: Props ): Component {
	return (
		<div className="error-message">
			{ children }
		</div>
	);
}