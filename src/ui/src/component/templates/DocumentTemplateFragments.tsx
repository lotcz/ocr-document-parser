import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {useCallback, useContext} from "react";
import DocumentTemplateFragment from "./DocumentTemplateFragment";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
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
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);

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

	const getNewFragmentName = useCallback(
		() => {
			let i = 0;
			let name = 'fragment';
			let exists = true;
			while (exists) {
				name = `fragment-${i}`;
				exists = fragments.some((f) => f.name === name);
				i++;
			}
			return name;

		},
		[fragments]
	);

	return (
		<div className="document-template-fragments position-relative">
			<Table size="sm" className="text-small">
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
