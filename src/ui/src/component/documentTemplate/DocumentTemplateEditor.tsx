import {Button, Col, Dropdown, Form, Row, Stack} from "react-bootstrap";
import DocumentTemplateForm from "./DocumentTemplateForm";
import {BasicEditorComponentProps} from "../../types/ComponentProps";
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";
import {useState} from "react";
import StorageImage from "../image/StorageImage";

export type DocumentTemplateEditorProps = BasicEditorComponentProps<DocumentTemplate> & {
	onPreviewUpload: (f: File) => any;
};

export default function DocumentTemplateEditor({entity, onClose, onSave, onDelete, onPreviewUpload}: DocumentTemplateEditorProps) {
	const [editingEntity, setEditingEntity] = useState<DocumentTemplate>({...entity});

	const onChange = () => {
		setEditingEntity({...editingEntity});
	}

	return (
		<div className="document-template-editor">
			<Stack>
				<Row>
					<Col>
						<DocumentTemplateForm entity={editingEntity} onChange={onChange}/>
					</Col>
					<Col>
						<div>
							<Form.Label>Vzor:</Form.Label>
							<Form.Control
								type="file"
								onChange={(e) => {
									const files = (e.target as HTMLInputElement).files
									const f = files ? files[0] : null;
									if (f) onPreviewUpload(f);
								}}
							/>
						</div>
						<StorageImage path={editingEntity.previewImg} size="preview"/>
					</Col>
				</Row>
				<Stack direction="horizontal">
					<Button onClick={() => onSave(editingEntity)}>Uložit</Button>
					<Button onClick={onClose} variant="link">Zpět</Button>
					<Dropdown>
						<Dropdown.Toggle variant="link" id="dropdown-basic">
							Více...
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={onDelete}>Smazat</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Stack>
			</Stack>
		</div>
	);
}
