import {FragmentTemplateStub} from "../../types/entity/Template";
import {useCallback, useContext, useRef, useState} from "react";
import StorageImage from "../image/StorageImage";
import DocumentFragment from "./DocumentFragment";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";

export type DocumentFragmentsProps = BasicFormComponentProps<Array<FragmentStub>> & {
	document: DocumentStub;
	onSelected: (f: FragmentStub) => any;
	selectedFragment?: FragmentStub;
	fragmentTemplates: Array<FragmentTemplateStub>;
};

export default function DocumentFragments({entity, selectedFragment, fragmentTemplates, onChange, onSelected, document}: DocumentFragmentsProps) {
	const fragments = entity;
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [editingFragment, setEditingFragment] = useState<FragmentTemplateStub>()
	const [isResizing, setIsResizing] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null);

	const deleteFragment = useCallback(
		(fragment: FragmentStub) => {
			onChange(fragments.filter((f) => f !== fragment));
		},
		[fragments, onChange]
	);

	const updateFragment = useCallback(
		(old: FragmentStub, updated: FragmentStub) => {
			if (old !== updated) {
				deleteFragment(old);
				fragments.push(updated);
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
			<StorageImage path={document.imagePath} size="preview"/>
			<div
				ref={ref}
				className="position-absolute"
				style={{left: 0, top: 0, right: 0, bottom: 0}}
			>
				{
					fragments && fragments.map(
						(f, i) => <DocumentFragment
							key={i}
							entity={f}
							template={fragmentTemplates.find(t => t.id === f.fragmentTemplateId)}
							onDelete={() => deleteFragment(f)}
							onChange={(u) => updateFragment(f, u)}
							isSelected={f === selectedFragment}
						/>
					)
				}
			</div>
		</div>
	);
}
