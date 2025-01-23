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
			width: `${fragment.width * 100}%`,
			height: `${fragment.height * 100}%`
		});
	}, [fragment]);

	return (
		<div className="document-template-fragment-editor position-absolute" style={stl}>
			<div className="pb-2" style={{top: '-100%'}}>
				<Stack direction="horizontal" gap={2}>
					<Button onClick={onDelete}>Smazat</Button>
				</Stack>
			</div>
			<div className="fragment-frame border" style={{left: 0, top: 0, right: 0, bottom: 0}}>

			</div>
		</div>
	);
}
