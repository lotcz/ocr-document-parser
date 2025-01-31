import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Col, Row, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable} from "zavadil-react-common";
import StorageImage from "../image/StorageImage";
import {Page, PagingRequest, PagingUtil} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStub} from "../../types/entity/Document";
import {FolderStub} from "../../types/entity/Folder";

const HEADER_FOLDERS = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Název'},
	{name: 'template', label: 'Šablona'}
];

const HEADER_DOCS = [
	{name: 'id', label: 'ID'},
	{name: 'template', label: 'Šablona'},
	{name: 'imagePath', label: 'Image'}
];

function FolderBrowser() {
	const {folderIdString, pagingString} = useParams();
	const folderId = Number(folderIdString);
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const paging = PagingUtil.pagingRequestFromString(pagingString);
	const [documents, setDocuments] = useState<Page<DocumentStub>>();
	const [folders, setFolders] = useState<Page<FolderStub>>();

	const createNewFolder = () => {
		navigate(`/documents/folders/add-folder/${folderId}`)
	};

	const navigateToPage = (folderId?: number | null, p?: PagingRequest) => {
		navigate(`/documents/folders/${folderId}/${PagingUtil.pagingRequestToString(p)}`);
	}

	const navigateToFolder = (f: FolderStub) => {
		navigateToPage(f.id);
	}

	const createNewDocument = () => {
		navigate(`/documents/detail/add/${folderId}`)
	};

	const navigateToDocument = (d: DocumentStub) => {
		navigate(`/documents/detail/${d.id}`);
	}

	const loadFoldersHandler = useCallback(
		() => {
			restClient
				.loadFolders(folderId, paging)
				.then(setFolders)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[paging, folderId, restClient, userAlerts]
	);

	useEffect(loadFoldersHandler, [loadFoldersHandler]);

	const loadDocumentsHandler = useCallback(
		() => {
			setDocuments(undefined);
			restClient
				.loadFolderDocuments(folderId, paging)
				.then(setDocuments)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[paging, folderId, restClient, userAlerts]
	);

	useEffect(loadDocumentsHandler, [loadDocumentsHandler]);

	return (
		<Row>
			<Col>
				<Stack direction="horizontal">
					<Button onClick={createNewFolder}>+ Nový</Button>
				</Stack>
				<div className="d-flex pt-2 gap-3">
					{
						(!folders) ? <span><Spinner/></span>
							: (
								<AdvancedTable
									header={HEADER_FOLDERS}
									paging={paging}
									totalItems={folders.totalItems}
									onPagingChanged={(p) => navigateToPage(folderId, p)}
									hover={true}
									striped={true}
								>
									{
										(folders.totalItems === 0) ? <tr>
												<td colSpan={HEADER_FOLDERS.length}>No templates</td>
											</tr> :
											folders.content.map((folder, index) => {
												return (
													<tr key={index} role="button" onClick={() => navigateToFolder(folder)}>
														<td>{folder.id}</td>
														<td>{folder.name}</td>
														<td>{folder.documentTemplateId}</td>
													</tr>
												);
											})
									}
								</AdvancedTable>
							)
					}
				</div>
			</Col>
			<Col>
				<Stack direction="horizontal">
					<Button onClick={createNewDocument}>+ Nový Dokument</Button>
				</Stack>
				<div className="d-flex pt-2 gap-3">
					{
						(!documents) ? <span><Spinner/></span>
							: (
								<AdvancedTable
									header={HEADER_DOCS}
									paging={paging}
									totalItems={documents.totalItems}
									onPagingChanged={(p) => navigateToPage(folderId, p)}
									hover={true}
									striped={true}
								>
									{
										(documents.totalItems === 0) ? <tr>
												<td colSpan={HEADER_FOLDERS.length}>No templates</td>
											</tr> :
											documents.content.map((document, index) => {
												return (
													<tr key={index} role="button" onClick={() => navigateToDocument(document)}>
														<td>{document.id}</td>
														<td>{document.documentTemplateId}</td>
														<td><StorageImage path={document.imagePath} size="thumb"/></td>
													</tr>
												);
											})
									}
								</AdvancedTable>
							)
					}
				</div>
			</Col>

		</Row>
	);
}

export default FolderBrowser;
