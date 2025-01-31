import {useCallback, useContext, useRef, useState} from "react";
import StorageImage from "../image/StorageImage";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";
import DocumentFragmentImage from "./DocumentFragmentImage";
import {FragmentTemplateStub} from "../../types/entity/Template";

export type DocumentFragmentsImageProps = BasicFormComponentProps<Array<FragmentStub>> & {
	document: DocumentStub;
	onSelected: (f: FragmentStub) => any;
	selectedFragment?: FragmentStub;
	fragmentTemplates: Array<FragmentTemplateStub>;
};

export default function DocumentFragmentsImage({
	entity,
	onChange,
	onSelected,
	fragmentTemplates,
	selectedFragment,
	document
}: DocumentFragmentsImageProps) {
	const fragments = entity;
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [isResizing, setIsResizing] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null);

	const fragmentSelected = useCallback(
		(fragment: FragmentStub) => {
			onChange(fragments);
			onSelected(fragment);
		},
		[fragments, onSelected, onChange]
	);

	return (
		<div className="document-fragments-image position-relative">
			<StorageImage path={document.imagePath} size="preview"/>
			<div
				ref={ref}
				className="position-absolute"
				style={{left: 0, top: 0, right: 0, bottom: 0}}
			>
				{
					fragments && fragments.map(
						(f, i) => <DocumentFragmentImage
							key={i}
							entity={f}
							template={fragmentTemplates.find(t => t.id === f.fragmentTemplateId)}
							isSelected={f === selectedFragment}
							onChange={fragmentSelected}
						/>
					)
				}
			</div>
		</div>
	);
}
