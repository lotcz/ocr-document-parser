import {Button, Dropdown, Form, Spinner, Stack} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {useNavigate, useParams} from "react-router";
import DocumentFragments from "./DocumentFragments";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";
import DocumentFragmentsImage from "./DocumentFragmentsImage";
import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {NumberUtil} from "zavadil-ts-common";
import {FolderChain} from "../../types/entity/Folder";
import FolderChainControl from "../folders/FolderChainControl";
import DocumentStateControl from "../folders/DocumentStateControl";
import {BsPencil, BsRecycle} from "react-icons/bs";
import {VscRefresh} from "react-icons/vsc";
import {FaFloppyDisk} from "react-icons/fa6";

const NEW_DOCUMENT: DocumentStub = {
	folderId: 0,
	state: 'Waiting',
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
	const [folder, setFolder] = useState<FolderChain>();
	const [folderDocumentTemplate, setFolderDocumentTemplate] = useState<DocumentTemplateStub>();
	const [document, setDocument] = useState<DocumentStub>();
	const [fragments, setFragments] = useState<Array<FragmentStub>>();
	const [selectedFragment, setSelectedFragment] = useState<FragmentStub>();
	const [documentId, setDocumentId] = useState<number | null | undefined>(NumberUtil.parseNumber(id));
	const [documentTemplateId, setDocumentTemplateId] = useState<number | null>();
	const [fragmentTemplates, setFragmentTemplates] = useState<Array<FragmentTemplateStub>>();
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStub>>();
	const [fragmentsChanged, setFragmentsChanged] = useState<boolean>(false);
	const [stubChanged, setStubChanged] = useState<boolean>(false);
	const [imageUpload, setImageUpload] = useState<File>();

	const navigateBack = () => {
		navigate(-1);
	};

	// FOLDER

	const loadFolder = useCallback(
		() => {
			const id = document?.folderId;
			if (!id) return;
			restClient.loadFolderChain(id)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, userAlerts, document]
	);

	useEffect(loadFolder, [folderId, document]);

	// DOCUMENT TEMPLATES

	const loadFolderDocumentTemplate = useCallback(
		() => {
			if (!folder) return;
			restClient.loadDocumentTemplateForFolder(folder)
				.then((dt) => {
					if (dt) {
						setFolderDocumentTemplate(dt);
					} else {
						userAlerts.err('No template found for document!');
					}
				})
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, folder, userAlerts]
	);

	useEffect(loadFolderDocumentTemplate, [folder]);

	const loadDocumentTemplates = useCallback(
		() => {
			restClient.loadDocumentTemplates({page: 0, size: 1000})
				.then((p) => p.content)
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, userAlerts]
	);

	useEffect(loadDocumentTemplates, []);

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
			if (documentId === null) {
				const d = {...NEW_DOCUMENT};
				d.folderId = Number(folderId);
				setDocument(d);
				setStubChanged(true);
				setFragments([]);
				return;
			}
			if (documentId === undefined) return;
			;
			restClient.loadDocument(documentId)
				.then(setDocument)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, userAlerts, documentId, folderId]
	);

	useEffect(loadDocument, [documentId]);

	useEffect(
		() => {
			if (document && document.id && !id) {
				navigate(`/documents/detail/${document.id}`);
				return;
			}
			setDocumentId(document?.id);
			setDocumentTemplateId(document?.documentTemplateId || folderDocumentTemplate?.id);
		},
		[document, folderDocumentTemplate]
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

	useEffect(loadFragments, [documentId]);

	const sendToQueue = useCallback(
		() => {
			if (!document) return;
			document.state = 'Waiting';
			setDocument({...document});
			setStubChanged(true);
		},
		[document]
	);

	const reload = useCallback(
		() => {
			loadDocument();
			loadFragments();
		},
		[loadDocument, loadFragments]
	);

	if (!document) {
		return <Spinner/>
	}

	const isChanged = stubChanged || fragmentsChanged || imageUpload !== undefined;

	return (
		<div className="document-editor">
			<div className="border-bottom">
				<FolderChainControl folder={folder} isActive={false}/>
			</div>
			<div className="d-flex justify-content-between gap-2 p-2">
				<Stack direction="horizontal" gap={2}>
					<Button
						size="sm"
						onClick={saveDocument}
						disabled={!isChanged}
						className={`d-flex align-items-center gap-2 ${isChanged ? 'btn-unsaved' : ''}`}
					>
						<FaFloppyDisk/>
						Uložit
					</Button>
					<Button
						onClick={reload}
						size="sm"
						className="text-nowrap d-flex align-items-center gap-2">
						<VscRefresh/> Obnovit
					</Button>
					<Button size="sm" onClick={navigateBack} variant="link">Zpět</Button>
					<Dropdown>
						<Dropdown.Toggle size="sm" variant="link" id="dropdown-basic">
							Více...
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={deleteDocument}>Smazat</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Stack>
			</div>
			<div className="p-1 px-3">
				<div className="d-flex gap-3">
					<Form className="w-25">
						<div className="d-flex flex-column gap-2">
							<div className="d-flex gap-2 align-items-center justify-content-between">
								<Form.Label>Stav:</Form.Label>
								<div className="d-flex align-items-center gap-2">
									<DocumentStateControl state={document.state}/>
									{
										document.state !== 'Waiting' &&
										<Button
											onClick={sendToQueue}
											size="sm"
											className="text-nowrap d-flex align-items-center gap-2"
											title="Zpracovat znovu"
										>
											<BsRecycle/>
										</Button>
									}
								</div>
							</div>
							<div className="d-flex gap-2 align-items-center">
								<Form.Label>Šablona:</Form.Label>
								<Form.Select
									value={document.documentTemplateId || ''}
									onChange={(e) => {
										document.documentTemplateId = NumberUtil.parseNumber(e.target.value);
										setDocument({...document});
										setStubChanged(true);
									}}
								>
									{
										<option key={""} value={""}>(výchozí) {folderDocumentTemplate ? folderDocumentTemplate.name : ''}</option>
									}
									{
										documentTemplates && documentTemplates.map(
											(dt, i) => <option key={i} value={Number(dt.id)}>{dt.name}</option>
										)
									}
								</Form.Select>
								{
									(document.documentTemplateId || folderDocumentTemplate) &&
									<Button
										onClick={
											() => {
												const templateId = document.documentTemplateId || folderDocumentTemplate?.id;
												navigate(`/templates/detail/${templateId}`);
											}
										}
										size="sm"
										className="text-nowrap d-flex align-items-center gap-2"
										title="Upravit šablonu"
									>
										<BsPencil/>
									</Button>
								}
							</div>
							<div className="mt-3">
								{
									fragments && fragmentTemplates && <DocumentFragments
										fragments={fragments}
										document={document}
										fragmentTemplates={fragmentTemplates}
										selectedFragment={selectedFragment}
										onSelected={setSelectedFragment}
									/>
								}
							</div>
						</div>
					</Form>

					<div className="d-flex flex-column gap-2">
						<div className="d-flex gap-2 align-items-center">
							<Form.Label>Soubor:</Form.Label>
							<Form.Control
								disabled={true}
								readOnly={true}
								defaultValue={document.imagePath}
							/>
						</div>
						<div className="d-flex gap-2 align-items-center">
							<Form.Label>Nahrát:</Form.Label>
							<Form.Control
								type="file"
								onChange={(e) => {
									const files = (e.target as HTMLInputElement).files
									const f = files ? files[0] : undefined;
									setImageUpload(f);
								}}
							/>
						</div>
						{
							fragments && fragmentTemplates && <DocumentFragmentsImage
								fragments={fragments}
								document={document}
								fragmentTemplates={fragmentTemplates}
								selectedFragment={selectedFragment}
								onSelected={setSelectedFragment}
							/>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
