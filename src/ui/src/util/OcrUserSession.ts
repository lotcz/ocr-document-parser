import {createContext} from "react";

export class OcrUserSession {
	theme: string = "dark";
}

export const OcrUserSessionContext = createContext(new OcrUserSession());


export type OcrUserSessionUpdate = ((s: OcrUserSession) => any) | null;

export const OcrUserSessionUpdateContext = createContext<OcrUserSessionUpdate>(null);
