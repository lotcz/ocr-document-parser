import {FragmentTemplateStub} from "../../types/entity/Template";
import {FormWithDeleteComponentProps} from "../../types/ComponentProps";
import {NumberUtil} from "zavadil-ts-common";
import LanguageName from "../general/LanguageName";
import React from "react";

export type DocumentTemplateFragmentProps = FormWithDeleteComponentProps<FragmentTemplateStub> & {
	isSelected: boolean;
	onSelected: () => any;
};

export default function PageTemplateFragment({entity, onSelected, isSelected}: DocumentTemplateFragmentProps) {
	const template = entity;
	return (
		<tr
			className={`cursor-pointer ${isSelected ? 'table-primary' : ''}`}
			onClick={onSelected}
		>
			<td>
				<pre>{template.name}</pre>
			</td>
			<td><LanguageName id={template.languageId}/></td>
			<td>{NumberUtil.portionToPercent(template.top, 2)}</td>
			<td>{NumberUtil.portionToPercent(template.left, 2)}</td>
			<td>{NumberUtil.portionToPercent(template.width, 2)}</td>
			<td>{NumberUtil.portionToPercent(template.height, 2)}</td>
		</tr>
	);
}
