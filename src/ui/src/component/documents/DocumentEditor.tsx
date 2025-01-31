import {Button, Col, Dropdown, Form, Row, Spinner, Stack} from "react-bootstrap";
import {useCallback, useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {useNavigate, useParams} from "react-router";
import DocumentFragments from "./DocumentFragments";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";
import DocumentFragmentsImage from "./DocumentFragmentsImage";
import {FragmentTemplateStub} from "../../types/entity/Template";

const NEW_DOCUMENT: DocumentStub = {
	documentTemplateId: 0,
	folderId: 0,
	imagePath: '',
	created_on: new Date(),
	last_update_on: new Date()
};

export default function DocumentEditor() {
	const {id, folderId} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [document, setDocument] = useState<DocumentStub>();
	const [fragments, setFragments] = useState<Array<FragmentStub>>();
	const [selectedFragment, setSelectedFragment] = useState<FragmentStub>();
	const [documentId, setDocumentId] = useState<number | null | undefined>(Number(id));
	const [documentTemplateId, setDocumentTemplateId] = useState<number>();
	const [fragmentTemplates, setFragmentTemplates] = useState<Array<FragmentTemplateStub>>();
	const [fragmentsChanged, setFragmentsChanged] = useState<boolean>(false);
	const [stubChanged, setStubChanged] = useState<boolean>(false);
	const [imageUpload, setImageUpload] = useState<File>();

	const navigateBack = () => {
		navigate(-1);
	};

	// FRAGMENT TEMPLATES

	const loadFragmentTemplates = useCallback(
		() => {
			setFragmentTemplates(undefined);
			if (!documentTemplateId) {
				return;
			}
			restClient.loadDocumentTemplateFragments(documentTemplateId)
				.then(setFragmentTemplates)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[documentTemplateId, restClient, userAlerts]
	);

	useEffect(loadFragmentTemplates, [documentTemplateId]);

	// DOCUMENT

	const loadDocument = useCallback(
		() => {
			if (!documentId) {
				const d = {...NEW_DOCUMENT};
				d.folderId = Number(folderId);
				setDocument(d);
				return;
			}
			restClient.loadDocument(documentId)
				.then(setDocument)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, userAlerts, documentId, folderId]
	);

	useEffect(
		() => {
			setDocumentId(document?.id);
			setDocumentTemplateId(document?.documentTemplateId);
		},
		[document]
	);

	const saveDocument = useCallback(
		() => {
			if (document !== undefined)
				restClient.saveDocument(document)
					.then(
						async (saved) => {
							setStubChanged(false);
							if (imageUpload) {
								const img = await restClient.uploadDocumentImage(Number(saved.id), imageUpload);
								setImageUpload(undefined);
								saved.imagePath = img;
								return saved;
							} else {
								return Promise.resolve(saved);
							}
						}
					).then(
					async (saved) => {
						if (fragmentsChanged && fragments) {
							return restClient
								.saveDocumentFragments(Number(saved.id), fragments)
								.then(setFragments)
								.then(() => setFragmentsChanged(false))
								.then(() => saved);
						} else {
							return Promise.resolve(saved);
						}
					}
				).then(setDocument)
					.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[imageUpload, restClient, userAlerts, document, fragments, fragmentsChanged]
	);

	const deleteDocument = useCallback(
		() => {
			const dtId = id || document?.id;
			if (dtId) {
				confirmDialog.confirm(
					'Smazat?',
					'Opravdu si přejete smazat tento dokument?',
					() => {
						restClient.deleteDocument(Number(dtId))
							.then(navigateBack)
							.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
					}
				);
			} else {
				navigateBack();
			}
		},
		[restClient, userAlerts, document, confirmDialog, id, navigateBack]
	);

	const stubOnChanged = useCallback(
		(d: DocumentStub) => {
			setStubChanged(true);
			setDocument({...d});
		},
		[]
	);

	useEffect(loadDocument, [id]);

	// FRAGMENTS

	const loadFragments = useCallback(
		() => {
			if (!documentId) {
				setFragments(undefined);
				return;
			}
			restClient.loadDocumentFragments(documentId)
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[documentId, restClient, userAlerts]
	);

	const fragmentsOnChanged = useCallback(
		(nf: Array<FragmentStub>) => {
			setFragmentsChanged(true);
			setFragments([...nf]);
		},
		[]
	);

	useEffect(loadFragments, [documentId]);

	if (!document) {
		return <span>no doc</span>
	}

	if (!fragmentTemplates) {
		return <span>no templates, doc id {documentId}, template id {documentTemplateId}</span>
	}

	if (!(document && fragmentTemplates)) {
		return <Spinner/>
	}

	return (
		<div className="document-template-fra">
			<div>
				<Row className="pb-2">
					<Stack direction="horizontal" gap={2}>
						<Button
							onClick={saveDocument}
							className={stubChanged || fragmentsChanged || imageUpload !== undefined ? 'btn-unsaved' : ''}
						>
							Uložit
						</Button>
						<Button onClick={navigateBack} variant="link">Zpět</Button>
						<Dropdown>
							<Dropdown.Toggle variant="link" id="dropdown-basic">
								Více...
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item onClick={deleteDocument}>Smazat</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Stack>
				</Row>
				<Row className="mt-2">
					<Col>
						<div>
							<Form.Label>Vzor:</Form.Label>
							<Form.Control
								type="file"
								onChange={(e) => {
									const files = (e.target as HTMLInputElement).files
									const f = files ? files[0] : undefined;
									setImageUpload(f);
								}}
							/>
						</div>
						<div className="mt-3">
							{
								fragments && <DocumentFragmentsImage
									entity={fragments}
									document={document}
									onChange={fragmentsOnChanged}
									fragmentTemplates={fragmentTemplates}
									onSelected={setSelectedFragment}
								/>
							}
						</div>
					</Col>
					<Col>

						<div className="mt-3">
							{
								fragments && <DocumentFragments
									entity={fragments}
									document={document}
									onChange={fragmentsOnChanged}
									fragmentTemplates={fragmentTemplates}
									onSelected={setSelectedFragment}
								/>
							}
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}
