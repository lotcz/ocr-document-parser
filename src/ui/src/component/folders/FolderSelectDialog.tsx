import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {BasicDialogProps, Localize} from "zavadil-react-common";
import {useState} from "react";
import FolderSelect from "./FolderSelect";

export type FolderSelectDialogProps = BasicDialogProps & {
	defaultFolderId?: number;
	onSelected: (id: number) => any;
};

function FolderSelectDialog({onClose, onSelected, defaultFolderId}: FolderSelectDialogProps) {
	const [folderId, setFolderId] = useState<number | undefined>(defaultFolderId);

	return <Modal show={true} onHide={onClose}>
		<ModalHeader>
			<Localize text="Select folder"/>
		</ModalHeader>
		<ModalBody>
			<FolderSelect onSelected={setFolderId} selectedFolderId={folderId}/>
		</ModalBody>
		<ModalFooter>
			<div>
				<Button onClick={onClose}>Close</Button>
			</div>
		</ModalFooter>
	</Modal>
}

export default FolderSelectDialog;
