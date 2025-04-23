import {FragmentTemplateStub} from "../../types/entity/Template";
import {FragmentStub} from "../../types/entity/Document";

export type DocumentFragmentProps = {
	fragment: FragmentStub;
	isSelected: boolean;
	onSelected: () => any;
	template?: FragmentTemplateStub;
};

export default function Fragment({fragment, template, onSelected, isSelected}: DocumentFragmentProps) {
	return (
		<tr
			className={`${isSelected ? 'table-active table-primary' : ''}`}
			onClick={onSelected}
		>
			<td>
				<h4>
					<strong>
						<pre>{template ? template.name : '??? (no template!)'}</pre>
					</strong>
				</h4>
			</td>
			<td>{fragment.text}</td>
		</tr>
	);
}
