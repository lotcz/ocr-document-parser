import {createContext} from "react";

export type WaitingDialogContextContent = {
	show: (text?: string, onCancel?: () => any) => any;
	hide: () => any;
};

export const WaitingDialogContext = createContext<WaitingDialogContextContent>(
	{
		show: () => null,
		hide: () => null
	}
);
