import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {useCallback} from "react";
import DocumentTemplateFragment from "./DocumentTemplateFragment";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Table} from "react-bootstrap";

export type DocumentTemplateFragmentsProps = BasicFormComponentProps<Array<FragmentTemplateStub>> & {
	documentTemplate: DocumentTemplateStub;
	selectedFragment?: FragmentTemplateStub;
	onSelected: (f: FragmentTemplateStub) => any;
};

export default function DocumentTemplateFragments({
	entity,
	onChange,
	onSelected,
	selectedFragment
}: DocumentTemplateFragmentsProps) {
	const fragments = entity;

	const deleteFragment = useCallback(
		(fragment: FragmentTemplateStub) => {
			onChange(fragments.filter((f) => f !== fragment));
		},
		[fragments, onChange]
	);

	const updateFragment = useCallback(
		(old: FragmentTemplateStub, updated: FragmentTemplateStub) => {
			if (old !== updated) {
				deleteFragment(old);
				fragments.push(updated);
				onChange([...fragments]);
				onSelected(updated);
			} else {
				for (let i = 0; i < fragments.length; i++) {
					if (fragments[i] === updated) {
						fragments[i] = {...updated};
						onSelected(fragments[i]);
						break;
					}
				}
			}
			onChange(fragments);
		},
		[deleteFragment, fragments, onChange]
	);

	return (
		<div className="document-template-fragments position-relative">
			<Table size="sm" className="text-small overflow-auto">
				<thead>
				<tr>
					<th>Název</th>
					<th>Jazyk</th>
					<th>Top</th>
					<th>Left</th>
					<th>Width</th>
					<th>Height</th>
				</tr>
				</thead>
				<tbody>
				{
					fragments && fragments.map(
						(f, i) => <DocumentTemplateFragment
							key={i}
							entity={f}
							onDelete={() => deleteFragment(f)}
							onChange={(u) => updateFragment(f, u)}
							onSelected={() => onSelected(f)}
							isSelected={f === selectedFragment}
						/>
					)
				}
				</tbody>
			</Table>
		</div>
	);
}
