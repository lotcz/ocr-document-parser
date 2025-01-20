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
			<div>
				<Row className="pb-2">
					<Stack direction="horizontal" gap={2}>
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
				</Row>
				<Row className="mt-2">
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
						<div className="mt-3">
							<StorageImage path={editingEntity.previewImg} size="preview"/>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}
