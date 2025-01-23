import {FragmentTemplateStub} from "../../types/entity/DocumentTemplate";
import {useCallback, useContext} from "react";
import StorageImage from "../image/StorageImage";
import DocumentTemplateFragment from "./DocumentTemplateFragment";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {BasicFormComponentProps} from "../../types/ComponentProps";

export type DocumentTemplateFragmentsProps = BasicFormComponentProps<Array<FragmentTemplateStub>> & {
	previewImg: string;
};

export default function DocumentTemplateFragments({entity, onChange, previewImg}: DocumentTemplateFragmentsProps) {
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
			}
			onChange(fragments);
		},
		[deleteFragment, fragments, onChange]
	);

	return (
		<div className="document-template-fragments position-relative">
			<div className="position-absolute" style={{left: 0, top: 0, right: 0, bottom: 0}}>
				{
					fragments && fragments.map(
						(f, i) => <DocumentTemplateFragment
							key={i}
							entity={f}
							onDelete={() => deleteFragment(f)}
							onChange={(u) => updateFragment(f, u)}
						/>
					)
				}
			</div>
			<StorageImage path={previewImg} size="preview"/>
		</div>
	);
}
