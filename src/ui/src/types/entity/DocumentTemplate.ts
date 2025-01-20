import {Page} from "zavadil-ts-common";
import {TemplateBase} from "./TemplateBase";

export type FragmentTemplate = TemplateBase & {
	top: number;
	left: number;
	width: number;
	height: number;
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
