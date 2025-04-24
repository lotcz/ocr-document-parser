import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Stack} from 'react-bootstrap';
import {NumberUtil} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStubWithPages} from "../../types/entity/Document";
import FolderChainControl from "./FolderChainControl";
import {BsArrow90DegUp, BsFileImage, BsFolder, BsFolderPlus, BsPencil, BsRecycle, BsTable, BsUpload} from "react-icons/bs";
import {VscRefresh} from "react-icons/vsc";
import {ConfirmDialogContext, IconButton, IconSwitch, LocalizationContext, Localize} from "zavadil-react-common";
import MassUploadDialog from "./MassUploadDialog";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from '../../util/OcrUserSession';
import {OcrNavigateContext} from "../../util/OcrNavigation";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import {SelectFolderContext} from "../../util/SelectFolderContext";
import {LuDelete, LuMoveUpRight} from "react-icons/lu";
import FolderBrowser from "./FolderBrowser";
import {FolderChain} from "../../types/entity/Folder";
import {PreviewImageContext} from "../../util/PreviewImageContext";

function FolderBrowserTab() {
	const {id} = useParams();
	const navigate = useNavigate();
	const ocrNavigate = useContext(OcrNavigateContext);
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const session = useContext(OcrUserSessionContext);
	const sessionUpdate = useContext(OcrUserSessionUpdateContext);
	const localization = useContext(LocalizationContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const folderDialog = useContext(SelectFolderContext);
	const previewImage = useContext(PreviewImageContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
	const [documentPreviewLeft, setDocumentPreviewLeft] = useState<boolean>(false);
	const [selectedDocuments, setSelectedDocuments] = useState<Array<DocumentStubWithPages>>([]);
	const [reloadCounter, setReloadCounter] = useState<number>(0);

	const folderId = useMemo(
		() => NumberUtil.parseNumber(id),
		[id]
	);

	const reload = useCallback(
		() => {
			setReloadCounter(reloadCounter + 1);
		},
		[reloadCounter]
	);

	const processFolder = useCallback(
		() => {
			confirmDialog.confirm(
				'Process Documents',
				'All documents in this folder will be processed again.',
				() => {
					if (folderId) restClient
						.folders
						.updateDocumentsState(folderId, 'Waiting')
						.then(reload);
				}
			);
		},
		[confirmDialog, restClient, reload, folderId]
	);

	useEffect(
		() => {
			if (!folderId) return;
			restClient.folders.loadFolderChain(folderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId]
	);

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
				folderId
			);
		},
		[reload, folderId, restClient, selectedDocuments, folderDialog, waitingDialog]
	);

	const deleteSelected = useCallback(
		() => {
			if (selectedDocuments.length === 0) return;
			confirmDialog.confirm(
				"Delete Documents?",
				`This will delete all ${selectedDocuments.length} selected documents`,
				async () => {
					waitingDialog.show(`Deleting ${selectedDocuments.length} documents...`);
					waitingDialog.progress(0, selectedDocuments.length);
					let done = 0;
					for (let i = 0; i < selectedDocuments.length; i++) {
						const d = selectedDocuments[i];
						if (d.id) {
							try {
								await restClient.documents.delete(d.id);
							} catch (e: any) {
								userAlerts.err(e);
							}
						}
						done++;
						waitingDialog.progress(done, selectedDocuments.length);
					}
					waitingDialog.hide();
					reload();
				}
			);
		},
		[reload, restClient, selectedDocuments, confirmDialog, waitingDialog, userAlerts]
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
								onClick={() => navigate(ocrNavigate.documents.add(folderId))}
								size="sm"
								icon={<BsFileImage/>}
							>
								<Localize text="New document"/>
							</IconButton>
						}
						{
							folder && <IconButton
								onClick={processFolder}
								size="sm"
								icon={<BsRecycle/>}
							>
								<Localize text="Process"/>
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
						{
							(selectedDocuments.length > 0) && <IconButton
								onClick={deleteSelected}
								size="sm"
								icon={<LuDelete/>}
							>
								<Localize text="Delete..."/>
							</IconButton>
						}
					</Stack>
				</div>
				<div>
					<FolderBrowser
						reloadCounter={reloadCounter}
						folderId={folderId}
						onMouseOver={
							(d) => {
								if (d) previewImage.show(d.imagePath, documentPreviewLeft)
								else previewImage.hide();
							}
						}
						onMouseOnLeft={setDocumentPreviewLeft}
						onSelectedDocumentsChanged={setSelectedDocuments}
						onFolderClicked={(f) => navigate(ocrNavigate.folders.detail(f.id))}
						onDocumentClicked={(d) => navigate(ocrNavigate.documents.detail(d.id))}
					/>
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

export default FolderBrowserTab;
