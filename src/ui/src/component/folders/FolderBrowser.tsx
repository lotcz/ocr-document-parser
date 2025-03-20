import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Spinner, Stack} from 'react-bootstrap';
import {NumberUtil, Page} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStub} from "../../types/entity/Document";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderChainControl from "./FolderChainControl";
import {BsArrow90DegUp, BsFileImage, BsFolderPlus, BsPencil} from "react-icons/bs";
import FolderControl from "./FolderControl";
import FolderDocumentControl from "./FolderDocumentControl";
import {VscRefresh} from "react-icons/vsc";
import {IconButton} from "zavadil-react-common";

function FolderBrowser() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [folders, setFolders] = useState<Page<FolderStub>>();
	const [documents, setDocuments] = useState<Page<DocumentStub>>();

	const folderId = useMemo(
		() => NumberUtil.parseNumber(id),
		[id]
	);

	const createNewFolder = () => {
		navigate(`/documents/folders/add/${folderId || ''}`)
	};

	const editFolder = () => {
		navigate(`/documents/folders/${folderId}/edit`)
	};

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
			setDocuments(undefined);
			restClient.folders.loadFolderDocuments(folderId, {page: 0, size: 100})
				.then(setDocuments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts]
	);

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
						<IconButton
							onClick={reload}
							size="sm"
							icon={<VscRefresh/>}
						>
							Obnovit
						</IconButton>
						{
							folder &&
							<Button onClick={editFolder} size="sm"
									className="text-nowrap d-flex align-items-center gap-2"><BsPencil/> Upravit</Button>
						}
						<Button onClick={createNewFolder} size="sm" className="text-nowrap d-flex align-items-center gap-2">
							<BsFolderPlus/> Nová složka
						</Button>
						{
							folder &&
							<Button onClick={createNewDocument} size="sm" className="text-nowrap d-flex align-items-center gap-2">
								<BsFileImage/> Nový dokument
							</Button>
						}
					</Stack>
				</div>

				<div className="d-flex flex-wrap p-2 gap-2">
					{
						folder && <Button
							onClick={() => navigateToFolder(folder?.parent?.id)}
							variant="link"
							className="d-flex align-items-center border gap-2"
						>
							<BsArrow90DegUp/> ...
						</Button>
					}
					{
						folders && folders.content.map(
							(folder, index) => <FolderControl key={index} folder={folder} border={true}/>
						)
					}
					{
						documents && documents.content.map(
							(document, index) => <FolderDocumentControl key={index} document={document}/>
						)
					}
					{
						(folders === undefined || documents === undefined) && <span><Spinner/></span>
					}
				</div>
			</div>
		</div>
	);
}

export default FolderBrowser;
