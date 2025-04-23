import {EntityBase, LookupTableEntity} from "zavadil-ts-common";

export type TemplateBase = EntityBase & {
	name?: string | null;
}

export type DocumentTemplateBase = LookupTableEntity & {
	previewImg?: string | null;
}

export type DocumentTemplateStub = DocumentTemplateBase & {
	languageId?: number | null;
	width?: number;
	height?: number;
}

export type PageTemplateBase = EntityBase & {
	previewImg?: string | null;
	pageNumber: number;
}

export type PageTemplateStub = PageTemplateBase & {
	documentTemplateId?: number | null;
	inheritFromPageTemplateId?: number | null;
}

export type FragmentTemplateBase = TemplateBase & {
	top: number;
	left: number;
	width: number;
	height: number;
}

export type FragmentTemplateStub = FragmentTemplateBase & {
	pageTemplateId: number;
	languageId?: number | null;
}

export type PageTemplateStubWithFragments = PageTemplateStub & {
	fragments: Array<FragmentTemplateStub>;
}

export type DocumentTemplateStubWithPages = DocumentTemplateStub & {
	pages: Array<PageTemplateStubWithFragments>;
}
