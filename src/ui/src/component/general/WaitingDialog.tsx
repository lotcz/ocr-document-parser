import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from "react-bootstrap";
import {BasicDialogProps, Localize} from "zavadil-react-common";

export type WaitingDialogProps = BasicDialogProps & {
	onCancel?: () => any;
};

function WaitingDialog({onClose, onCancel, name, text}: WaitingDialogProps) {

	return <Modal show={true} onHide={onClose}>
		{
			name && <ModalHeader><Localize text={name}/></ModalHeader>
		}
		<ModalBody>
			<Spinner/>
			{
				text && <div>{text}</div>
			}
		</ModalBody>
		{
			onCancel &&
			<ModalFooter>
				<div>
					<Button onClick={onCancel} variant="link"><Localize text="Cancel"/></Button>
				</div>
			</ModalFooter>
		}
	</Modal>
}

export default WaitingDialog;
