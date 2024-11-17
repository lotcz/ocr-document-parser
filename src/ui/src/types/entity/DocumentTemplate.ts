import {Page} from "incomaker-react-ts-commons";
import { TemplateBase } from "./TemplateBase";

export type FragmentTemplate = TemplateBase & {
	top: number;
	left: number;
	width: number;
	height: number;
	languageEffective: string;
}

export type DocumentTemplate = TemplateBase & {
	width?: number;
	height?: number;
	fragments: Array<FragmentTemplate>;
}

export type DocumentTemplatePage = Page<DocumentTemplate>;
