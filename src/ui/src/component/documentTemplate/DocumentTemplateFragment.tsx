import {Button, Dropdown, Stack} from "react-bootstrap";
import {BasicEditorComponentProps} from "../../types/ComponentProps";
import {FragmentTemplate} from "../../types/entity/DocumentTemplate";
import {useEffect, useState} from "react";

export type DocumentTemplateFragmentProps = BasicEditorComponentProps<FragmentTemplate> & {};

export default function DocumentTemplateFragment({entity, onClose, onSave, onDelete}: DocumentTemplateFragmentProps) {
	const [editingEntity, setEditingEntity] = useState<FragmentTemplate>({...entity});
	const [stl, setStl] = useState<object>({});

	const onChange = () => {
		onSave({...editingEntity});
	}

	useEffect(() => {
		setStl({
			top: `${editingEntity.top * 100}%`,
			left: `${editingEntity.left * 100}%`,
			width: `${editingEntity.width * 100}%`,
			height: `${editingEntity.height * 100}%`
		});
	}, [editingEntity]);

	return (
		<div className="document-template-fragment-editor position-absolute" style={stl}>
			<div className="pb-2" style={{top: '-100%'}}>
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
			</div>
			<div className="fragment-frame">

			</div>
		</div>
	);
}
