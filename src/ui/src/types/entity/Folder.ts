import {EntityBase} from "./EntityBase";
import {DocumentTemplateStub} from "./Template";

export type FolderBase = EntityBase & {
	name: string;
}

export type FolderStub = FolderBase & {
	parentId?: number;
	documentTemplateId?: number;
}

export type FolderProjection = {
	name: string;
	documentTemplate: DocumentTemplateStub;
}
