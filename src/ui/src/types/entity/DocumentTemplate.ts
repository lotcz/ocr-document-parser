import {Page} from "zavadil-ts-common";
import {TemplateBase} from "./TemplateBase";

export type FragmentTemplateBase = TemplateBase & {
	top: number;
	left: number;
	width: number;
	height: number;
}

export type FragmentTemplateStub = FragmentTemplateBase & {
	documentTemplateId: number;
}

export type FragmentTemplate = FragmentTemplateBase & {
	documentTemplate: DocumentTemplate;
	languageEffective: string;
}

export type DocumentTemplateBase = TemplateBase & {
	previewImg: string;
}

export type DocumentTemplateStub = DocumentTemplateBase & {
	width?: number;
	height?: number;
}

export type DocumentTemplate = DocumentTemplateBase & {

	fragments: Array<FragmentTemplate>;
}

export type DocumentTemplatePage = Page<DocumentTemplate>;
