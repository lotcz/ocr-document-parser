import {Button, Dropdown, Form, Spinner, Stack} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import DocumentFragments from "./DocumentFragments";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";
import DocumentFragmentsImage from "./DocumentFragmentsImage";
import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {NumberUtil} from "zavadil-ts-common";
import {FolderChain} from "../../types/entity/Folder";
import FolderChainControl from "../folders/FolderChainControl";
import DocumentStateControl from "./DocumentStateControl";
import {BsPencil, BsRecycle} from "react-icons/bs";
import {VscRefresh} from "react-icons/vsc";
import {ConfirmDialogContext, LoadingButton, Localize, LookupSelect, SaveButton} from "zavadil-react-common";
import {SelectFolderContext} from "../../util/SelectFolderContext";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";

const NEW_DOCUMENT: DocumentStub = {
	folderId: 0,
	state: 'Waiting',
	imagePath: '',
	createdOn: new Date(),
	lastUpdatedOn: new Date()
};

export default function DocumentEditor() {
	const {id, folderId} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const folderDialog = useContext(SelectFolderContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [folderDocumentTemplate, setFolderDocumentTemplate] = useState<DocumentTemplateStub>();
	const [document, setDocument] = useState<DocumentStub>();
	const [fragments, setFragments] = useState<Array<FragmentStub>>();
	const [selectedFragment, setSelectedFragment] = useState<FragmentStub>();
	const [documentTemplateId, setDocumentTemplateId] = useState<number | null>();
	const [fragmentTemplates, setFragmentTemplates] = useState<Array<FragmentTemplateStub>>();
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStub>>();
	const [fragmentsChanged, setFragmentsChanged] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [stubChanged, setStubChanged] = useState<boolean>(false);
	const [imageUpload, setImageUpload] = useState<File>();

	const navigateBack = () => {
		navigate(-1);
	};

	const documentId = useMemo<number | null>(
		() => NumberUtil.parseNumber(id),
		[id]
	);

	// FOLDER

	const actualFolderId = useMemo(
		() => {
			if (document && document.folderId) return document.folderId;
			return NumberUtil.parseNumber(folderId);
		},
		[document, folderId]
	);

	const loadFolder = useCallback(
		() => {
			if (!actualFolderId) return;
			restClient.folders.loadFolderChain(actualFolderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, userAlerts, actualFolderId]
	);

	useEffect(loadFolder, [actualFolderId]);

	// DOCUMENT TEMPLATES

	const loadFolderDocumentTemplate = useCallback(
		() => {
			if (!folder) return;
			restClient.documentTemplates.loadDocumentTemplateForFolder(folder)
				.then((dt) => {
					if (dt) {
						setFolderDocumentTemplate(dt);
					} else {
						userAlerts.err('No template found for document!');
					}
				})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, folder, userAlerts]
	);

	useEffect(loadFolderDocumentTemplate, [folder]);

	const loadDocumentTemplates = useCallback(
		() => {
			restClient.documentTemplates.loadAll()
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(e))
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
			restClient
				.documentTemplates
				.loadDocumentTemplateFragments(documentTemplateId)
				.then(setFragmentTemplates)
				.catch((e: Error) => userAlerts.err(e))
		},
		[documentTemplateId, restClient, userAlerts]
	);

	useEffect(loadFragmentTemplates, [documentTemplateId]);

	// DOCUMENT

	const loadDocument = useCallback(
		() => {
			if (documentId === null) {
				if (folder === undefined) return;
				const d = {...NEW_DOCUMENT};
				d.folderId = Number(folder.id);
				d.documentTemplateId = folder.documentTemplateId;
				setDocument(d);
				setStubChanged(true);
				setFragments([]);
				return;
			}
			setIsLoading(true);
			restClient.documents.loadSingle(documentId)
				.then(setDocument)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsLoading(false));
		},
		[restClient, userAlerts, documentId, folder]
	);

	useEffect(loadDocument, [documentId, folder]);

	useEffect(
		() => {
			if (document && document.id && !documentId) {
				navigate(`/documents/detail/${document.id}`);
				return;
			}
			setDocumentTemplateId(document?.documentTemplateId || folderDocumentTemplate?.id);
		},
		[navigate, documentId, document, folderDocumentTemplate]
	);

	const saveDocument = useCallback(
		() => {
			if (document === undefined) return;
			setIsSaving(true);
			restClient.documents.save(document)
				.then(
					async (saved) => {
						setStubChanged(false);
						if (imageUpload) {
							const img = await restClient.documents.uploadDocumentImage(Number(saved.id), imageUpload);
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
						return restClient.documents.saveDocumentFragments(Number(saved.id), fragments)
							.then(setFragments)
							.then(() => setFragmentsChanged(false))
							.then(() => saved);
					} else {
						return Promise.resolve(saved);
					}
				}
			)
				.then(setDocument)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsSaving(false));
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
						restClient.documents.delete(Number(dtId))
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

	const moveToFolder = useCallback(
		() => {
			folderDialog.selectFolder(
				(folderId: number) => {
					if (!document) {
						userAlerts.warn("No document!");
						return;
					}
					waitingDialog.show("Moving to folder...");
					document.folderId = folderId;
					restClient.documents
						.save(document)
						.then(
							() => {
								waitingDialog.hide();
								setDocument({...document});
							}
						);
				},
				document?.folderId
			)
		},
		[userAlerts, document, folderDialog, waitingDialog]
	);

	// FRAGMENTS

	const loadFragments = useCallback(
		() => {
			if (!documentId) {
				setFragments(undefined);
				return;
			}
			restClient.documents.loadDocumentFragments(documentId)
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
					<SaveButton
						size="sm"
						onClick={saveDocument}
						isChanged={isChanged}
						loading={isSaving}
						disabled={isLoading}
					>
						Uložit
					</SaveButton>
					<LoadingButton
						size="sm"
						onClick={reload}
						icon={<VscRefresh/>}
						loading={isLoading}
						disabled={isSaving}
					>
						<Localize text="Refresh"/>
					</LoadingButton>
					<Dropdown>
						<Dropdown.Toggle size="sm" variant="link" id="dropdown-basic">
							<Localize text="More..."/>
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={deleteDocument}><Localize text="Delete"/></Dropdown.Item>
							<Dropdown.Item onClick={moveToFolder}><Localize text="Move"/></Dropdown.Item>
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
								<Form.Label><Localize text="Template"/>:</Form.Label>
								<LookupSelect
									showEmptyOption={false}
									id={document.documentTemplateId}
									options={documentTemplates}
									onChange={(e) => {
										document.documentTemplateId = e;
										setDocument({...document});
										setStubChanged(true);
									}}
								/>
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
									fragments === undefined && <span>No fragments</span>
								}
								{
									fragmentTemplates === undefined && <span>No fragment templates</span>
								}
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
							<Form.Label><Localize text="File"/>:</Form.Label>
							<Form.Control
								disabled={true}
								readOnly={true}
								defaultValue={document.imagePath}
							/>
						</div>
						<div className="d-flex gap-2 align-items-center">
							<Form.Label><Localize text="Upload"/>:</Form.Label>
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
							<DocumentFragmentsImage
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
