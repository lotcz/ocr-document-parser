import {EntityBase} from "zavadil-ts-common";

export type FragmentBase = EntityBase & {
	imagePath: string;
	text?: string;
}

export type FragmentStub = FragmentBase & {
	documentId: number;
	fragmentTemplateId: number;
}

export type DocumentBase = EntityBase & {
	imagePath: string;
	state: string;
}

export type DocumentStub = DocumentBase & {
	folderId: number;
	documentTemplateId?: number | null;
}

export type DocumentStubWithFragments = DocumentStub & {
	fragments: Array<FragmentStub>;
}

export type Document = DocumentBase & {
	languageEffective: string;
	fragments: Array<FragmentStub>;
}
