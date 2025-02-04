import {EntityBase} from "./EntityBase";

export type FolderBase = EntityBase & {
	name: string;
}

export type FolderStub = FolderBase & {
	parentId?: number | null;
	documentTemplateId?: number | null;
}

export type FolderChain = FolderBase & {
	parent?: FolderChain | null;
	documentTemplateId?: number | null;
}
