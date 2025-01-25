import {Button, Stack} from "react-bootstrap";
import {FormWithDeleteComponentProps} from "../../types/ComponentProps";
import {FragmentTemplateStub} from "../../types/entity/DocumentTemplate";
import {useContext, useEffect, useState} from "react";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";

export type DocumentTemplateFragmentProps = FormWithDeleteComponentProps<FragmentTemplateStub> & {};

export default function DocumentTemplateFragment({entity, onChange, onDelete}: DocumentTemplateFragmentProps) {
	const fragment = entity;
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [stl, setStl] = useState<object>({});

	useEffect(() => {
		setStl({
			top: `${fragment.top * 100}%`,
			left: `${fragment.left * 100}%`,
			width: `${Math.max(fragment.width, 0.01) * 100}%`,
			height: `${Math.max(fragment.height, 0.01) * 100}%`
		});
	}, [fragment]);

	return (
		<div
			className="document-template-fragment-editor position-absolute"
			style={stl}
			onMouseDown={(e) => e.stopPropagation()}
		>
			<div className="position-relative pb-2" style={{top: '-2rem'}}>
				<Stack direction="horizontal" gap={2}>
					<Button size="sm" onClick={onDelete}>Smazat</Button>
				</Stack>
			</div>
			<div className="fragment-frame position-absolute border bg-dark-subtle opacity-25" style={{left: 0, top: 0, right: 0, bottom: 0}}>

			</div>
		</div>
	);
}
