import {createContext} from "react";

export type SelectFolderContextContent = {
	selectFolder: (onSelected: (id: number) => any, defaultFolderId?: number) => any;
};

export const SelectFolderContext = createContext<SelectFolderContextContent>({selectFolder: () => null});
