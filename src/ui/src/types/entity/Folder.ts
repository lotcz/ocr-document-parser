import {EntityBase} from "zavadil-ts-common";

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

export function findInChain(chain: FolderChain, id: number): FolderChain | undefined {
	if (chain.id === id) return chain;
	if (chain.parent) return findInChain(chain.parent, id);
	return undefined;
}
