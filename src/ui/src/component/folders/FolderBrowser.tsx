import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Spinner, Stack} from 'react-bootstrap';
import {NumberUtil, Page} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStub} from "../../types/entity/Document";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderChainControl from "./FolderChainControl";
import {BsArrow90DegUp, BsFileImage, BsFolderPlus, BsPencil} from "react-icons/bs";
import FolderControl from "./FolderControl";
import FolderDocumentControl from "./FolderDocumentControl";

function FolderBrowser() {
	const {id} = useParams();
	const folderId = NumberUtil.parseNumber(id);
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [folders, setFolders] = useState<Page<FolderStub>>();
	const [documents, setDocuments] = useState<Page<DocumentStub>>();

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

	const loadFolderChainHandler = useCallback(
		() => {
			if (!folderId) return;
			restClient
				.loadFolderChain(folderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[folderId, restClient, userAlerts]
	);

	useEffect(loadFolderChainHandler, [folderId]);

	const loadFoldersHandler = useCallback(
		() => {
			restClient
				.loadFolders(folderId, {page: 0, size: 100})
				.then(setFolders)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[folderId, restClient, userAlerts]
	);

	useEffect(loadFoldersHandler, [folderId]);

	const loadDocumentsHandler = useCallback(
		() => {
			setDocuments(undefined);
			restClient
				.loadFolderDocuments(folderId, {page: 0, size: 100})
				.then(setDocuments)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[folderId, restClient, userAlerts]
	);

	useEffect(loadDocumentsHandler, [loadDocumentsHandler]);

	return (
		<div>
			<div className="">
				<div className="border-bottom p-1">
					<FolderChainControl folder={folder}/>
				</div>

				<div className="d-flex justify-content-between gap-2 p-2">
					<Stack direction="horizontal" gap={2}>
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

				<div className="d-flex p-2 gap-2">
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
							(folder, index) => <FolderControl folder={folder} border={true}/>
						)
					}
					{
						documents && documents.content.map(
							(document, index) => <FolderDocumentControl document={document}/>
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
