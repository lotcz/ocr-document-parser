import {createContext} from "react";
import {ConfirmDialogProps} from "./ConfirmDialog";

export class ConfirmDialogContextData {
	setProps: (props?: ConfirmDialogProps) => any;

	constructor(setProps: (props?: ConfirmDialogProps) => any) {
		this.setProps = setProps;
	}

	confirm(name: string, text: string, onConfirmed: () => any) {
		this.setProps(
			{
				name: name,
				text: text,
				onConfirm: () => {
					onConfirmed();
					this.setProps(undefined);
				},
				onClose: () => this.setProps(undefined)
			}
		)
	}
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextData>(new ConfirmDialogContextData(() => undefined));
