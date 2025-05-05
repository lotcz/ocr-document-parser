import {Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, ProgressBar, Spinner, Stack} from "react-bootstrap";
import {BasicDialogProps} from "zavadil-react-common";
import {useCallback, useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";

export type MassUploadDialogProps = BasicDialogProps & {
	folderId: number;
};

function MassUploadDialog({onClose, folderId}: MassUploadDialogProps) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [queue, setQueue] = useState<FileList | null>(null);
	const [processed, setProcessed] = useState<number>(0);
	const [message, setMessage] = useState<string>();

	const processQueue = useCallback(
		() => {
			if (queue === null) return;
			if (queue.length === processed) {
				setMessage(`Processed ${processed} images`);
				return;
			}
			const file: File | null = queue.item(processed);
			if (file === null) {
				setProcessed(processed + 1);
				return;
			}
			restClient.documents
				.uploadImageToFolder(folderId, file)
				.catch(e => userAlerts.err(e))
				.finally(
					() => {
						setProcessed(processed + 1);
					}
				);
		},
		[folderId, processed, restClient, userAlerts, queue]
	);

	useEffect(processQueue, [queue, processed]);

	return <Modal show={true} onHide={onClose}>
		<ModalHeader>
			Hromadné nahrávání
		</ModalHeader>
		<ModalBody>
			<div>
				<Form.Label>Soubor(y):</Form.Label>
				<Form.Control
					type="file"
					multiple
					disabled={queue !== null}
					onChange={(e) => {
						setQueue((e.target as HTMLInputElement).files);
						setProcessed(0);
					}}
				/>
			</div>
			<div>
				<Form.Label className="pt-2">
					<Stack direction="horizontal" gap={2}>
						<div>Průběh nahrávání:</div>
						{
							queue && <>
								{
									queue.length < processed && <Spinner size="sm"/>
								}
								<div>{processed}/{queue.length}</div>
							</>
						}
					</Stack>
				</Form.Label>
				{
					<ProgressBar
						now={processed}
						min={0}
						max={queue ? queue.length : 1}
					/>
				}
				{
					message && <div>{message}</div>
				}
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<Button onClick={onClose}>Close</Button>
			</div>
		</ModalFooter>
	</Modal>
}

export default MassUploadDialog;
