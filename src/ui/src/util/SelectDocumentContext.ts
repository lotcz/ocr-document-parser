import {createContext} from "react";
import {DocumentStub} from "../../../../../okarina-ts-client/src/type/entity/Document";

export type SelectDocumentContextContent = {
	selectDocument: (onSelected: (d: DocumentStub) => any, defaultFolderId?: number | null) => any;
};

export const SelectDocumentContext = createContext<SelectDocumentContextContent>({selectDocument: () => null});
