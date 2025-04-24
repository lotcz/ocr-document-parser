import {createContext} from "react";

export type PreviewImageContextContent = {
	show: (path?: string | null, left?: boolean) => any;
	hide: () => any;
};

export const PreviewImageContext = createContext<PreviewImageContextContent>({show: () => null, hide: () => null});
