import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Spinner, Stack} from 'react-bootstrap';
import {DateUtil, NumberUtil, Page, PagingRequest} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStubWithFragments} from "../../types/entity/Document";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderChainControl from "./FolderChainControl";
import {BsArrow90DegUp, BsFileImage, BsFolder, BsFolderPlus, BsPencil, BsTable, BsUpload} from "react-icons/bs";
import FolderControl from "./FolderControl";
import FolderDocumentControl from "./FolderDocumentControl";
import {VscRefresh} from "react-icons/vsc";
import {AdvancedTable, IconButton, IconSwitch, LocalizationContext} from "zavadil-react-common";
import MassUploadDialog from "./MassUploadDialog";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from '../../util/OcrUserSession';
import {OcrNavigateContext} from "../../util/OcrNavigation";
import {FragmentTemplateStub} from "../../types/entity/Template";
import StorageImage from "../image/StorageImage";
import DocumentStateControl from "../documents/DocumentStateControl";

const DEFAULT_HEADER = [
	{name: 'imagePath', label: 'Image'},
	{name: 'state', label: 'State'},
	{name: 'createdOn', label: 'Date'}
];

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
	const [folder, setFolder] = useState<FolderChain>();
	const [fragments, setFragments] = useState<Array<FragmentTemplateStub>>();
	const [folders, setFolders] = useState<Page<FolderStub>>();
	const [documents, setDocuments] = useState<Page<DocumentStubWithFragments>>();
	const [documentsPaging, setDocumentsPaging] = useState<PagingRequest>(DEFAULT_PAGING);
	const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>();

	const folderId = useMemo(
		() => NumberUtil.parseNumber(id),
		[id]
	);

	const templateId = useMemo(
		() => folder ? folder.documentTemplateId : null,
		[folder]
	);

	const showTable = useMemo(
		() => session.displayDocumentsTable === true,
		[session]
	);

	const translatedHeader = useMemo(
		() => DEFAULT_HEADER.map((f) => ({name: f.name, label: localization.translate(f.label)})),
		[localization]
	);

	const header = useMemo(
		() => {
			const h = [...translatedHeader];
			fragments?.forEach((f) => h.push({name: `fields.${f.name}`, label: f.name}));
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
			restClient.loadDocumentTemplateFragments(templateId)
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[templateId, restClient, userAlerts]
	);

	useEffect(loadFragments, [templateId]);

	const navigateToFolder = (folderId?: number | null) => {
		if (folderId) {
			navigate(`/documents/folders/${folderId}`);
		} else {
			navigate('/documents');
		}
	}

	const createNewDocument = () => {
		navigate(`/documents/detail/add/${folderId}`)
	};

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

	return (
		<div>
			<div className="">
				<div className="border-bottom p-1">
					<FolderChainControl folder={folder}/>
				</div>

				<div className="d-flex justify-content-between gap-2 p-2">
					<Stack direction="horizontal" gap={2}>
						{
							folder && <IconButton
								size="sm"
								onClick={() => navigateToFolder(folder?.parent?.id)}
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
							Nová složka
						</IconButton>
						{
							folder && <IconButton
								onClick={() => navigate(`${ocrNavigate.folders.detail(folderId)}/edit`)}
								size="sm"
								icon={<BsPencil/>}
							>
								Upravit
							</IconButton>
						}
						{
							folder && <IconButton
								onClick={createNewDocument}
								size="sm"
								icon={<BsFileImage/>}
							>
								Nový dokument
							</IconButton>
						}
						{
							folder && <IconButton
								onClick={() => setUploadDialogOpen(true)}
								size="sm"
								icon={<BsUpload/>}
							>
								Nahrát hromadně
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
								documents.content.length > 0 && <AdvancedTable
									header={header}
									paging={documentsPaging}
									totalItems={documents ? documents.totalItems : 0}
									onPagingChanged={setDocumentsPaging}
									hover={true}
								>
									{
										documents.content.map(
											(d, i) => <tr
												key={i}
												className="cursor-pointer"
												onClick={() => navigate(ocrNavigate.documents.detail(d.id))}
											>
												<td><StorageImage size="tiny" path={d.imagePath}/></td>
												<td><DocumentStateControl state={d.state}/></td>
												<td>{DateUtil.formatDateForHumans(d.createdOn)}</td>
												{
													fragments && fragments.map(
														(f, i) => <td key={i}>{d.fragments.find(df => df.fragmentTemplateId === f.id)?.text}</td>
													)
												}
											</tr>
										)
									}
								</AdvancedTable>
								: <div className="d-flex flex-wrap p-2 gap-2">
									{
										documents.content.map((d) => <FolderDocumentControl document={d}/>)
									}
								</div>
						) : <Spinner/>
					}
				</div>
			</div>
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
