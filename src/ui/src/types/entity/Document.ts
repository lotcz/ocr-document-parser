import {EntityBase} from "zavadil-ts-common";

export type DocumentBase = EntityBase & {
	imagePath: string;
	state: string;
	stateMessage?: string | null;
}

export type DocumentStub = DocumentBase & {
	folderId: number;
	documentTemplateId?: number | null;
	parentDocumentId?: number | null;
}

export type PageBase = EntityBase & {
	imagePath: string;
	state: string;
	stateMessage?: string | null;
	pageNumber: number;
}

export type PageStub = PageBase & {
	documentId: number;
	pageTemplateId: number;
}

export type FragmentBase = EntityBase & {
	imagePath: string;
	text?: string;
}

export type FragmentStub = FragmentBase & {
	documentId: number;
	fragmentTemplateId: number;
}

export type PageStubWithFragments = PageStub & {
	fragments: Array<FragmentStub>;
}

export type DocumentStubWithPages = DocumentStub & {
	pages: Array<PageStubWithFragments>;
}
