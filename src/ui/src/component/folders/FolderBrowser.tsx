import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Spinner, Stack} from 'react-bootstrap';
import {DateUtil, NumberUtil, Page, PagingRequest} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStub, DocumentStubWithFragments} from "../../types/entity/Document";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderChainControl from "./FolderChainControl";
import {BsArrow90DegUp, BsFileImage, BsFolder, BsFolderPlus, BsPencil, BsTable, BsUpload} from "react-icons/bs";
import FolderControl from "./FolderControl";
import FolderDocumentControl from "./FolderDocumentControl";
import {VscRefresh} from "react-icons/vsc";
import {IconButton, IconSwitch, LocalizationContext, Localize, SelectableTableHeader, TableWithSelect} from "zavadil-react-common";
import MassUploadDialog from "./MassUploadDialog";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from '../../util/OcrUserSession';
import {OcrNavigateContext} from "../../util/OcrNavigation";
import {FragmentTemplateStub} from "../../types/entity/Template";
import DocumentStateControl from "../documents/DocumentStateControl";
import DocumentImagePreviewFull from "../documents/DocumentImagePreviewFull";
import DocumentImagePreview from "../documents/DocumentImagePreview";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import {SelectFolderContext} from "../../util/SelectFolderContext";
import {LuMoveUpRight} from "react-icons/lu";

const DEFAULT_PAGING = {page: 0, size: 10};

function FolderBrowser() {
	const {id} = useParams();
	const navigate = useNavigate();
	const ocrNavigate = useContext(OcrNavigateContext);
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const session = useContext(OcrUserSessionContext);
	const sessionUpdate = useContext(OcrUserSessionUpdateContext);
	const localization = useContext(LocalizationContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const folderDialog = useContext(SelectFolderContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [fragments, setFragments] = useState<Array<FragmentTemplateStub>>();
	const [folders, setFolders] = useState<Page<FolderStub>>();
	const [documents, setDocuments] = useState<Page<DocumentStubWithFragments>>();
	const [documentsPaging, setDocumentsPaging] = useState<PagingRequest>(DEFAULT_PAGING);
	const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
	const [documentPreviewOpen, setDocumentPreviewOpen] = useState<DocumentStub>();
	const [documentPreviewLeft, setDocumentPreviewLeft] = useState<boolean>(false);
	const [selectedDocuments, setSelectedDocuments] = useState<Array<DocumentStubWithFragments>>([]);

	const folderId = useMemo(
		() => NumberUtil.parseNumber(id),
		[id]
	);

	const templateId = useMemo(
		() => folder ? folder.documentTemplateId : null,
		[folder]
	);

	const defaultHeader: SelectableTableHeader<DocumentStub> = useMemo(
		() => {
			return [
				{
					name: 'imagePath',
					label: 'Image',
					renderer: (d) => <DocumentImagePreview
						document={d}
						size="tiny"
						onMouseOver={() => setDocumentPreviewOpen(d)}
						onMouseOut={() => {
							if (documentPreviewOpen === d) setDocumentPreviewOpen(undefined);
						}}
					/>
				},
				{name: 'state', label: 'State', renderer: (d) => <DocumentStateControl state={d.state}/>},
				{name: 'createdOn', label: 'Date', renderer: (d) => DateUtil.formatDateForHumans(d.createdOn)}
			];
		},
		[documentPreviewOpen]
	);

	const translatedHeader: SelectableTableHeader<DocumentStubWithFragments> = useMemo(
		() => defaultHeader.map(
			(f) => {
				return {
					name: f.name,
					label: (typeof f.label === 'string') ? localization.translate(f.label) : f.label,
					renderer: f.renderer
				}
			}),
		[localization, defaultHeader]
	);

	const header: SelectableTableHeader<DocumentStubWithFragments> = useMemo(
		() => {
			const h: SelectableTableHeader<DocumentStubWithFragments> = [...translatedHeader];
			if (fragments) {
				fragments.forEach(
					(f) => h.push(
						{
							name: `fields.${f.name}`,
							label: f.name,
							renderer: (d) => d.fragments.find(df => df.fragmentTemplateId === f.id)?.text
						}
					)
				);
			}
			return h;
		},
		[fragments, translatedHeader]
	);

	const loadFragments = useCallback(
		() => {
			setFragments(undefined);
			if (!templateId) {
				return;
			}
			restClient
				.documentTemplates
				.loadDocumentTemplateFragments(templateId)
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[templateId, restClient, userAlerts]
	);

	useEffect(loadFragments, [templateId]);

	const loadFolderChain = useCallback(
		() => {
			if (!folderId) return;
			restClient.folders.loadFolderChain(folderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts]
	);

	const loadFolders = useCallback(
		() => {
			restClient.folders.loadFolders(folderId, {page: 0, size: 100})
				.then(setFolders)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts]
	);

	const loadDocuments = useCallback(
		() => {
			if (folderId === null) {
				setDocuments({content: [], totalItems: 0, pageSize: 0, pageNumber: 0});
				return;
			}
			setDocuments(undefined);
			restClient.folders.loadFolderDocumentsWithFragments(folderId, documentsPaging)
				.then(setDocuments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts, documentsPaging]
	);

	useEffect(loadDocuments, [documentsPaging]);

	const reload = useCallback(
		() => {
			loadFolderChain();
			loadFolders();
			loadDocuments();
		},
		[loadFolderChain, loadFolders, loadDocuments]
	);

	useEffect(reload, [folderId]);

	const moveToFolder = useCallback(
		() => {
			if (selectedDocuments.length === 0) return;
			folderDialog.selectFolder(
				async (folderId: number) => {
					waitingDialog.show(`Moving ${selectedDocuments.length} documents to folder...`);
					waitingDialog.progress(0, selectedDocuments.length);
					let done = 0;
					for (let i = 0; i < selectedDocuments.length; i++) {
						const d = selectedDocuments[i];
						d.folderId = folderId;
						await restClient.documents.save(d);
						done++;
						waitingDialog.progress(done, selectedDocuments.length);
					}
					waitingDialog.hide();
					reload();
				},
				folder?.id
			);
		},
		[reload, restClient, selectedDocuments, folderDialog, waitingDialog]
	);

	return (
		<div
			className="folder-browser"
			onMouseMove={
				(e) => {
					setDocumentPreviewLeft(e.clientX > (window.innerWidth / 2));
				}
			}
		>
			<div className="">
				<div className="border-bottom p-1">
					<FolderChainControl folder={folder}/>
				</div>

				<div className="d-flex justify-content-between gap-2 p-2">
					<Stack direction="horizontal" gap={2}>
						{
							folder && <IconButton
								size="sm"
								onClick={() => navigate(folder.parent ? ocrNavigate.folders.detail(folder.parent.id) : ocrNavigate.documents.list())}
								icon={<BsArrow90DegUp size={15}/>}
							/>
						}
						<IconButton
							onClick={reload}
							size="sm"
							icon={<VscRefresh size={15}/>}
						/>
						{
							<div className="border rounded p-1 px-2">
								<IconSwitch
									checked={session.displayDocumentsTable === true}
									iconOn={<BsTable/>}
									iconOff={<BsFolder/>}
									onChange={() => {
										session.displayDocumentsTable = !session.displayDocumentsTable;
										if (sessionUpdate) sessionUpdate({...session});
									}}
								/>
							</div>
						}
						<IconButton
							onClick={() => navigate(ocrNavigate.folders.add())}
							size="sm"
							icon={<BsFolderPlus/>}
						>
							<Localize text="New folder"/>
						</IconButton>
						{
							folder && <IconButton
								onClick={() => navigate(`${ocrNavigate.folders.detail(folderId)}/edit`)}
								size="sm"
								icon={<BsPencil/>}
							>
								<Localize text="Edit folder"/>
							</IconButton>
						}
						{
							folder && <IconButton
								onClick={() => navigate(ocrNavigate.folders.add())}
								size="sm"
								icon={<BsFileImage/>}
							>
								<Localize text="New document"/>
							</IconButton>
						}
						{
							folder && <IconButton
								onClick={() => setUploadDialogOpen(true)}
								size="sm"
								icon={<BsUpload/>}
							>
								<Localize text="Mass upload"/>
							</IconButton>
						}
						{
							(selectedDocuments.length > 0) && <IconButton
								onClick={moveToFolder}
								size="sm"
								icon={<LuMoveUpRight/>}
							>
								<Localize text="Move..."/>
							</IconButton>
						}
					</Stack>
				</div>
				{
					folders ? (
						(folders.content.length > 0) && <div className="d-flex flex-wrap p-2 gap-2">
							{
								folders.content.map(
									(folder, index) => <FolderControl key={index} folder={folder} border={true}/>
								)
							}
						</div>) : <Spinner/>
				}
				<div>
					{
						documents ? (
							session.displayDocumentsTable === true ?
								documents.content.length > 0 && <TableWithSelect
									header={header}
									paging={documentsPaging}
									totalItems={documents ? documents.totalItems : 0}
									onPagingChanged={setDocumentsPaging}
									onClick={(d) => navigate(ocrNavigate.documents.detail(d.id))}
									onSelect={setSelectedDocuments}
									items={documents.content}
								/>
								: <div className="d-flex flex-wrap p-2 gap-2">
									{
										documents.content.map(
											(d, i) => <FolderDocumentControl
												document={d}
												key={i}
												onMouseOver={() => setDocumentPreviewOpen(d)}
												onMouseOut={() => {
													if (documentPreviewOpen === d) setDocumentPreviewOpen(undefined);
												}}
											/>
										)
									}
								</div>
						) : <Spinner/>
					}
				</div>
			</div>
			{
				documentPreviewOpen && <DocumentImagePreviewFull document={documentPreviewOpen} left={documentPreviewLeft}/>
			}
			{
				folderId && uploadDialogOpen && <MassUploadDialog
					onClose={
						() => {
							setUploadDialogOpen(false);
							reload();
						}
					}
					folderId={folderId}
				/>
			}
		</div>
	);
}

export default FolderBrowser;
