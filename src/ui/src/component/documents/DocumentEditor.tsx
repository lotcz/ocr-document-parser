import {Button, Dropdown, Form, OverlayTrigger, Spinner, Stack, Tab, Tabs, Tooltip} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStubWithPages} from "../../types/entity/Document";
import {DocumentTemplateStubWithPages} from "../../types/entity/Template";
import {NumberUtil} from "zavadil-ts-common";
import {FolderChain} from "../../types/entity/Folder";
import FolderChainControl from "../folders/FolderChainControl";
import DocumentStateControl from "./DocumentStateControl";
import {BsPencil, BsRecycle} from "react-icons/bs";
import {VscRefresh} from "react-icons/vsc";
import {ConfirmDialogContext, LoadingButton, LocalizationContext, Localize, LookupSelect, SaveButton} from "zavadil-react-common";
import {SelectFolderContext} from "../../util/SelectFolderContext";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import PageEditor from "./PageEditor";
import {OcrNavigateContext} from "../../util/OcrNavigation";

const NEW_DOCUMENT: DocumentStubWithPages = {
	folderId: 0,
	state: 'Waiting',
	imagePath: '',
	createdOn: new Date(),
	lastUpdatedOn: new Date(),
	pages: []
};

export default function DocumentEditor() {
	const {id, folderId} = useParams();
	const navigate = useNavigate();
	const ocrNavigate = useContext(OcrNavigateContext);
	const localization = useContext(LocalizationContext);
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const folderDialog = useContext(SelectFolderContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [folderDocumentTemplate, setFolderDocumentTemplate] = useState<DocumentTemplateStubWithPages>();
	const [document, setDocument] = useState<DocumentStubWithPages>();
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStubWithPages>();
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStubWithPages>>();
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

	const folderTemplateOption = useMemo(
		() => {
			const def = localization.translate('Default');
			return `(${def}) ${folderDocumentTemplate ? folderDocumentTemplate.name : ''}`
		},
		[folderDocumentTemplate, localization]
	);

	const loadDocumentTemplate = useCallback(
		() => {
			if (document === undefined || !document.documentTemplateId) {
				setDocumentTemplate(folderDocumentTemplate);
				return;
			}
			restClient.documentTemplates.loadSingle(document.documentTemplateId)
				.then(setDocumentTemplate)
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, userAlerts, document, folderDocumentTemplate]
	);

	useEffect(loadDocumentTemplate, [folderDocumentTemplate, document]);

	const loadDocumentTemplates = useCallback(
		() => {
			restClient.documentTemplates.loadAll()
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, userAlerts]
	);

	useEffect(loadDocumentTemplates, []);


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

	const uploadDocumentImage = useCallback(
		() => {
			if (document && imageUpload) {
				return restClient.documents.uploadDocumentImage(Number(document.id), imageUpload)
					.then((d) => {
						setImageUpload(undefined);
						return d;
					});
			} else {
				return Promise.resolve(document);
			}
		},
		[imageUpload, restClient, document]
	);

	const saveDocumentStub = useCallback(
		() => {
			if (document === undefined) return Promise.resolve(undefined);
			if (stubChanged) {
				return restClient.documents.save(document)
					.then(
						(saved) => {
							setStubChanged(false);
							return Promise.resolve(saved);
						}
					);
			} else {
				return Promise.resolve(document);
			}
		},
		[restClient, document, stubChanged]
	);

	const saveDocument = useCallback(
		() => {
			saveDocumentStub().then(uploadDocumentImage)
				.then(
					(d) => {
						if (d && d.id && !documentId) {
							navigate(`/documents/detail/${d.id}`);
							return;
						} else {
							setDocument(d);
						}
					})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsSaving(false));
		},
		[saveDocumentStub, uploadDocumentImage, userAlerts, documentId, navigate]
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
							.catch((e: Error) => userAlerts.err(e));
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
		[userAlerts, restClient, document, folderDialog, waitingDialog]
	);

	const sendToQueue = useCallback(
		() => {
			if (!document) return;
			document.state = 'Waiting';
			setDocument({...document});
			setStubChanged(true);
		},
		[document]
	);

	if (!document) {
		return <Spinner/>
	}

	const isChanged = stubChanged || imageUpload !== undefined;

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
						onClick={loadDocument}
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
				<Form>
					<div className="d-flex gap-3">
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
									showEmptyOption={true}
									emptyOptionLabel={folderTemplateOption}
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
									<OverlayTrigger overlay={<Tooltip><Localize text="Edit template"/></Tooltip>}>
										<a
											href={ocrNavigate.templates.detail(document.documentTemplateId || folderDocumentTemplate?.id)}
											className="btn btn-primary p-2 text-nowrap d-flex align-items-center"
										>
											<BsPencil/>
										</a>
									</OverlayTrigger>
								}
							</div>
						</div>

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
						</div>
					</div>
				</Form>

				{
					document && document.pages.length > 0 && <Tabs
						defaultActiveKey="0"
					>
						{
							document.pages.map(
								(page, index) => <Tab
									key={index}
									title={`page-${page.pageNumber}`}
									eventKey={String(page.pageNumber)}
								>
									<PageEditor
										entity={page}
										template={documentTemplate?.pages.find(pt => pt.id === page.pageTemplateId)}
										onChange={() => userAlerts.warn("Changes of parsed pages are not implemented yet!")}
									/>
								</Tab>
							)
						}
					</Tabs>
				}

			</div>
		</div>
	)
}
