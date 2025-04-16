import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {BasicDialogProps, Localize} from "zavadil-react-common";
import {useState} from "react";
import FolderBrowser from "../folders/FolderBrowser";
import {DocumentStub} from "../../types/entity/Document";

export type DocumentSelectDialogProps = BasicDialogProps & {
	defaultFolderId?: number | null;
	onSelected: (d: DocumentStub) => any;
};

function DocumentSelectDialog({onClose, onSelected, defaultFolderId}: DocumentSelectDialogProps) {
	const [folderId, setFolderId] = useState<number | null | undefined>(defaultFolderId);

	return <Modal show={true} onHide={onClose}>
		<ModalHeader>
			<Localize text="Select folder"/>
		</ModalHeader>
		<ModalBody>
			<FolderBrowser
				folderId={folderId}
				onFolderClicked={(f) => setFolderId(f.id)}
				onDocumentClicked={(d) => onSelected(d)}
			/>
		</ModalBody>
		<ModalFooter>
			<div>
				<Button onClick={onClose} variant="link"><Localize text="Close"/></Button>
			</div>
		</ModalFooter>
	</Modal>
}

export default DocumentSelectDialog;
