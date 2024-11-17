import {Button, Col, Row, Stack} from "react-bootstrap";
import DocumentTemplateForm from "./DocumentTemplateForm";
import {BasicEditorComponentProps} from "../../types/ComponentProps";
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";
import {useState} from "react";

export type DocumentTemplateEditorProps = BasicEditorComponentProps<DocumentTemplate>;

export default function DocumentTemplateEditor({entity, onClose, onSave, onDelete}: DocumentTemplateEditorProps) {
	const [editingEntity, setEditingEntity] = useState<DocumentTemplate>({...entity});

	const onChange = () => {
		setEditingEntity({...editingEntity});
	}

	return (
		<div className="document-template-editor">
			<Stack>
				<Row>
					<Col>
						<DocumentTemplateForm entity={entity} onChange={onChange}/>
					</Col>
					<Col>
						preview
					</Col>
				</Row>
				<Stack direction="horizontal">
					<Button onClick={() => onSave(editingEntity)}>Uložit</Button>
					<Button onClick={onClose} variant="link">Zpět</Button>
				</Stack>
			</Stack>
		</div>
	);
}
