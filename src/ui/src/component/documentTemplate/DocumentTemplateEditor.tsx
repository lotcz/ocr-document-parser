import {Button, Col, Dropdown, Form, Row, Spinner, Stack} from "react-bootstrap";
import DocumentTemplateForm from "./DocumentTemplateForm";
import {DocumentTemplateStub, FragmentTemplate} from "../../types/entity/DocumentTemplate";
import {useCallback, useContext, useEffect, useState} from "react";
import StorageImage from "../image/StorageImage";
import DocumentTemplateFragment from "./DocumentTemplateFragment";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {useNavigate, useParams} from "react-router";


const NEW_TEMPLATE: DocumentTemplateStub = {
	name: 'New template',
	language: 'ces',
	previewImg: ''
};

export default function DocumentTemplateEditor() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStub>();
	const [fragments, setFragments] = useState<Array<FragmentTemplate>>();
	const [previewImg, setPreviewImg] = useState<File>();

	const onChange = useCallback(
		() => {
			if (documentTemplate) setDocumentTemplate({...documentTemplate});
		},
		[documentTemplate]
	);

	const navigateBack = useCallback(
		() => {
			navigate(-1);
		},
		[navigate]
	);

	const loadDocumentTemplate = useCallback(
		() => {
			if (id === undefined) {
				setDocumentTemplate(NEW_TEMPLATE);
				return;
			}
			restClient.loadDocumentTemplate(Number(id))
				.then(setDocumentTemplate)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, userAlerts, id]
	);

	const saveDocumentTemplate = useCallback(
		() => {
			if (documentTemplate != undefined)
				restClient.saveDocumentTemplate(documentTemplate)
					.then((saved) => {
						if (previewImg) {
							return restClient
								.uploadDocumentTemplatePreview(Number(saved.id), previewImg)
								.then((img) => {
									setPreviewImg(undefined);
									saved.previewImg = img;
									return saved;
								});
						} else {
							return Promise.resolve(saved);
						}
					})
					.then(setDocumentTemplate)
					.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[previewImg, restClient, userAlerts, documentTemplate]
	);

	const deleteDocumentTemplate = useCallback(
		() => {
			const dtId = id || documentTemplate?.id;
			if (dtId) {
				confirmDialog.confirm(
					'Smazat?',
					'Opravdu si přejete smazat tuto šablonu?',
					() => {
						restClient.deleteDocumentTemplate(Number(dtId))
							.then(navigateBack)
							.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
					}
				);
			} else {
				navigateBack();
			}
		},
		[restClient, userAlerts, documentTemplate, confirmDialog, id, documentTemplate, navigateBack]
	);

	const deleteFragment = useCallback(
		(fragment: FragmentTemplate) => {
			if (fragments === undefined) return;
			setFragments(fragments.filter((f) => f === fragment || f.name === fragment.name));
		},
		[fragments]
	);

	const saveFragment = useCallback(
		(fragment: FragmentTemplate) => {
			if (fragments === undefined) return;
			deleteFragment(fragment);
			fragments.push(fragment);
			setFragments([...fragments]);
		},
		[deleteFragment, fragments]
	);

	useEffect(loadDocumentTemplate, [id]);

	if (!documentTemplate) {
		return <Spinner/>
	}

	return (
		<div className="document-template-editor">
			<div>
				<Row className="pb-2">
					<Stack direction="horizontal" gap={2}>
						<Button onClick={saveDocumentTemplate}>Uložit</Button>
						<Button onClick={navigateBack} variant="link">Zpět</Button>
						<Dropdown>
							<Dropdown.Toggle variant="link" id="dropdown-basic">
								Více...
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item onClick={deleteDocumentTemplate}>Smazat</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Stack>
				</Row>
				<Row className="mt-2">
					<Col>
						<DocumentTemplateForm entity={documentTemplate} onChange={onChange}/>
					</Col>
					<Col>
						<div>
							<Form.Label>Vzor:</Form.Label>
							<Form.Control
								type="file"
								onChange={(e) => {
									const files = (e.target as HTMLInputElement).files
									const f = files ? files[0] : undefined;
									setPreviewImg(f);
								}}
							/>
						</div>
						<div className="mt-3">
							<div className="document-template-fragments">
								<div className="position-absolute">
									{
										fragments && fragments.map(
											(f) => <DocumentTemplateFragment
												entity={f}
												onClose={() => deleteFragment(f)}
												onDelete={() => deleteFragment(f)}
												onSave={saveFragment}
											/>
										)
									}
								</div>
								<StorageImage path={documentTemplate?.previewImg} size="preview"/>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}
