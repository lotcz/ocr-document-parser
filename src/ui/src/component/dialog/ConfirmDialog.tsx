import {Button, Modal, Stack} from "react-bootstrap";
import {BasicDialogProps} from "../../types/ComponentProps";

export type ConfirmDialogProps = BasicDialogProps & {
	onConfirm: () => any;
};

export default function ConfirmDialog({name, text, onClose, onConfirm}: ConfirmDialogProps) {
	return (
		<Modal show={true}>
			<Modal.Header>{name || 'Confirm'}</Modal.Header>
			<Modal.Body>{text}</Modal.Body>
			<Modal.Footer>
				<Stack direction="horizontal">
					<Button variant="link" onClick={onClose}>Zpět</Button>
					<Button variant="primary" onClick={onConfirm}>Ano</Button>
				</Stack>
			</Modal.Footer>
		</Modal>
	);
}
