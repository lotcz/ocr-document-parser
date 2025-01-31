import {Button, Col, Dropdown, Form, Row, Spinner, Stack} from "react-bootstrap";
import DocumentTemplateForm from "./DocumentTemplateForm";
import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {useCallback, useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {useNavigate, useParams} from "react-router";
import DocumentTemplateFragments from "./DocumentTemplateFragments";

const NEW_TEMPLATE: DocumentTemplateStub = {
	name: 'New template',
	language: 'ces',
	previewImg: '',
	created_on: new Date(),
	last_update_on: new Date()
};

export default function DocumentTemplateEditor() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStub>();
	const [fragments, setFragments] = useState<Array<FragmentTemplateStub>>();
	const [fragmentsChanged, setFragmentsChanged] = useState<boolean>(false);
	const [stubChanged, setStubChanged] = useState<boolean>(false);
	const [previewImg, setPreviewImg] = useState<File>();

	const navigateBack = useCallback(
		() => {
			navigate(-1);
		},
		[navigate]
	);

	// DOCUMENT TEMPLATE

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
			if (documentTemplate !== undefined)
				restClient.saveDocumentTemplate(documentTemplate)
					.then(
						async (saved) => {
							setStubChanged(false);
							if (previewImg) {
								const img = await restClient
									.uploadDocumentTemplatePreview(Number(saved.id), previewImg);
								setPreviewImg(undefined);
								saved.previewImg = img;
								return saved;
							} else {
								return Promise.resolve(saved);
							}
						}
					).then(
					async (saved) => {
						if (fragmentsChanged && fragments) {
							return restClient
								.saveDocumentTemplateFragments(Number(saved.id), fragments)
								.then(setFragments)
								.then(() => setFragmentsChanged(false))
								.then(() => saved);
						} else {
							return Promise.resolve(saved);
						}
					}
				).then(setDocumentTemplate)
					.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[previewImg, restClient, userAlerts, documentTemplate, fragments, fragmentsChanged]
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
		[restClient, userAlerts, documentTemplate, confirmDialog, id, navigateBack]
	);

	const stubOnChanged = useCallback(
		(dt: DocumentTemplateStub) => {
			setStubChanged(true);
			setDocumentTemplate({...dt});
		},
		[]
	)

	useEffect(loadDocumentTemplate, [id]);

	// FRAGMENTS

	const loadFragments = useCallback(
		() => {
			if (!(documentTemplate && documentTemplate.id)) {
				setFragments(undefined);
				return;
			}
			restClient.loadDocumentTemplateFragments(Number(documentTemplate.id))
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[documentTemplate, restClient, userAlerts]
	);

	const fragmentsOnChanged = useCallback(
		(nf: Array<FragmentTemplateStub>) => {
			setFragmentsChanged(true);
			setFragments([...nf]);
		},
		[]
	);

	useEffect(loadFragments, [documentTemplate]);

	if (!documentTemplate) {
		return <Spinner/>
	}

	return (
		<div className="document-template-fra">
			<div>
				<Row className="pb-2">
					<Stack direction="horizontal" gap={2}>
						<Button onClick={saveDocumentTemplate}
								className={stubChanged || fragmentsChanged || previewImg !== undefined ? 'btn-unsaved' : ''}>Uložit</Button>
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
						<DocumentTemplateForm entity={documentTemplate} onChange={stubOnChanged}/>
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
							{
								fragments && <DocumentTemplateFragments
									entity={fragments}
									onChange={fragmentsOnChanged}
									documentTemplate={documentTemplate}
								/>
							}
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}
