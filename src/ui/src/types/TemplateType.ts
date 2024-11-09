import {Page} from "incomaker-react-ts-commons";

export type EntityBase = {
	id: number | null;
}

export type TemplateBase = EntityBase & {
	name: string;
	language: string;
}

export type FragmentTemplate = TemplateBase & {
	top: number;
	left: number;
	width: number;
	height: number;
	languageEffective: string;
}

export type DocumentTemplate = TemplateBase & {
	width: number;
	height: number;
	fragments: Array<FragmentTemplate>;
}

export type DocumentTemplatePage = Page<DocumentTemplate>;
