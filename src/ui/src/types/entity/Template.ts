import {EntityBase} from "zavadil-ts-common";

export type TemplateBase = EntityBase & {
	name: string;
	language: string;
}

export type FragmentTemplateBase = Omit<TemplateBase, 'language'> & {
	language?: string;
	top: number;
	left: number;
	width: number;
	height: number;
}

export type FragmentTemplateStub = FragmentTemplateBase & {
	documentTemplateId: number;
}

export type DocumentTemplateBase = TemplateBase & {
	previewImg: string;
}

export type DocumentTemplateStub = DocumentTemplateBase & {
	width?: number;
	height?: number;
}
